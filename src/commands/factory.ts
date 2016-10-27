import { IConfig, ILog, Cli, inject, injectable, kernel, CommandsCli, BINDINGS } from "../core";
import { Command, ICommandConstructor } from "./command";
import { Group, IGroupConstructor } from "./group";
import * as _ from "lodash";
import { ICommandsDefinition, ICommandsParser, IParsedCommands } from "../definitions";
import { IOutput, IDescriptor } from "../io";
import { IInput } from "../io/input";


export interface ICommandRegistration<T> {
    name: string
    desc: string
    prettyName: string
    parent?: IGroupConstructor
    cls?: T
    type?: 'group' | 'command'
    showHelp ?: () => void
    toString ?: () => string
}

export interface IResolvedRegistration<T> extends ICommandRegistration<T> {
    parts: string[]
    arguments: string[]
    hasArguments: boolean
    tree: any
}

let groups: ICommandRegistration<IGroupConstructor>[]     = []
let commands: ICommandRegistration<ICommandConstructor>[] = []

export function command(name: string, prettyName: string, desc: string = '', parent: IGroupConstructor = null) {
    prettyName = prettyName || name
    return (cls: ICommandConstructor) => {
        commands.push({ name, cls, prettyName, desc, parent, type: 'command' })
    }
}
let registrations: ICommandRegistration<IGroupConstructor|ICommandConstructor>[] = []
export function COMMAND(name:string, prettyName: string, options:any = {}){
    options = _.merge({
        name,
        prettyName: prettyName || name,
        desc: '',
        parent: null,
        type: 'command',
        arguments: {},
        options: {}

    }, options)
    return (cls: ICommandConstructor|IGroupConstructor) => {
        options.cls = cls;
        registrations.push(options)
    }
}
export function group(name: string, prettyName: string, desc: string = '', parent: IGroupConstructor = null) {
    prettyName = prettyName || name
    return (cls: IGroupConstructor) => {
        groups.push({ name, cls, prettyName, desc, parent, type: 'group' })
    }
}


export interface ICommandFactory {

    groups: ICommandRegistration<IGroupConstructor>[]
    commands: ICommandRegistration<ICommandConstructor>[]


    addGroup(name: string, prettyName:string, cls: IGroupConstructor, desc?: string, parent?: IGroupConstructor)
    addCommand(name: string, prettyName:string, cls: ICommandConstructor, desc?: string, parent?: IGroupConstructor)

    createCommand(command: ICommandRegistration<ICommandConstructor>, argv?: any[]): Command
    createGroup(group: ICommandRegistration<IGroupConstructor>): Group

    getCommand(name: string, parent?: any): ICommandRegistration<ICommandConstructor>

    /**
     * Get the children of a group. When null is given as groupName, it will get children for the root 'group'
     * @param name
     * @param parent
     * @returns {ICommandRegistration<ICommandConstructor>[]}
     */
    getGroup(name: string, parent?: any): ICommandRegistration<IGroupConstructor>

    getGroupChildren(name: string|null, parent?: any): ICommandRegistration<ICommandConstructor|IGroupConstructor>[]

    getTree(parent?: any): any[]
    resolveFromArray(arr: string[]): IResolvedRegistration<IGroupConstructor|ICommandConstructor>
    resolveFromString(str: string): IResolvedRegistration<IGroupConstructor|ICommandConstructor>
}

export abstract class BaseCommandRegistration {

    @inject(BINDINGS.DESCRIPTOR)
    protected descriptor: IDescriptor;

    @inject(BINDINGS.COMMANDS_FACTORY)
    protected factory: ICommandFactory


    private _in;
    get in(): IInput { return this._in ? this._in : this._in = kernel.get<IInput>(BINDINGS.INPUT) }

    private _out;
    get out(): IOutput { return this._out ? this._out : this._out = kernel.get<IOutput>(BINDINGS.OUTPUT) }

    private _log;
    get log(): ILog { return this._log ? this._log : this._log = kernel.get<ILog>(BINDINGS.LOG) }

    private _config;
    get config(): IConfig { return this._config ? this._config : this._config = kernel.get<IConfig>(BINDINGS.CONFIG) }

    @inject(BINDINGS.CLI)
    protected cli: Cli<ICommandsDefinition, IParsedCommands, ICommandsParser>

    private failed: boolean      = false
    protected asyncMode: boolean = false;

    fire() {
        // this.defer = Promise.defer();
        this.parse();
        if ( this[ 'handle' ] ) this[ 'handle' ].apply(this);
        // if ( false === this.asyncMode ) {
        //     this.done();
        // }
        // return this.defer.promise;
    }

    protected async() {
        this.asyncMode = true;
        return this.done;
    }

    protected done() { }

    protected fail(reason?: string) {
        this.failed = true;
    }

    protected parse() {}

}

@injectable()
export class CommandFactory implements ICommandFactory {

    get groups() { return groups }

    get commands() { return commands }

    getGroupChildren(name: string, parent?: any): ICommandRegistration<ICommandConstructor|IGroupConstructor>[] {
        let groupRegistration = this.getGroup(name, parent)

        return commands.concat(<ICommandRegistration<any>[]> groups)
            .filter((item: ICommandRegistration<any>) => {
                return item.parent === (groupRegistration ? groupRegistration.cls : null)
            })
    }

    createCommand(registration, argv = []): Command {
        let command: Command = kernel.make<Command>(registration.cls);
        command.argv = argv
        command.definition.mergeOptions(kernel.get<CommandsCli>(BINDINGS.CLI).globalDefinition);
        command.definition.arguments(command.arguments);
        command.definition.options(command.options);
        if ( command.example ) command.definition.example(command.example)
        if ( command.usage ) command.definition.usage(command.usage)

        command.name   = registration.name
        command.desc   = registration.desc
        command.prettyName = registration.prettyName
        command.parent = registration.parent ? registration.parent : null

        return command;
    }

    createGroup(registration): Group {
        let group    = kernel.make<Group>(registration.cls);
        group.name   = registration.name
        group.desc   = registration.desc
        group.prettyName = registration.prettyName

        group.parent = registration.parent ? registration.parent : null
        return group
    }

    getTree(): any[] {
        // let all = Object.keys(commands).concat(Object.keys())
        return this.unflatten(<any[]>commands.concat(<any[]>groups));
    }

    /**
     * Resolves command or group from an array of arguments (useful for parsing the argv._ array)
     * @param arr
     */
    resolveFromArray(arr: string[]): IResolvedRegistration<IGroupConstructor|ICommandConstructor> {
        let tree  = this.getTree(),
            stop  = false,
            parts = [],
            resolved: IResolvedRegistration<IGroupConstructor|ICommandConstructor>

        while ( stop === false && arr.length > 0 ) {
            let part  = arr.shift();
            let found = _.find(tree, { name: part });
            if ( found ) {
                resolved = <any> found;
                parts.push(part);
                tree = found[ 'children' ] || {}
            } else {
                stop = true;
                arr.unshift(part)
            }

        }

        if ( resolved ) {
            resolved.tree         = tree;
            resolved.parts        = parts;
            resolved.arguments    = arr;
            resolved.hasArguments = arr.length > 0
            return resolved
        }
        return null;
    }

    resolveFromString(resolvable: string): IResolvedRegistration<IGroupConstructor|ICommandConstructor> {
        return this.resolveFromArray(resolvable.split(' '))
    }

    protected unflatten(array, parent: any = { cls: null }, tree: any[] = []) {


        var children = _.filter(array, (child: any) => {
            return child.parent === parent.cls;
        });

        if ( ! _.isEmpty(children) ) {
            if ( parent.cls === null ) {
                tree = children;
            } else {
                parent[ 'children' ] = children;
            }
            _.each(children, (child) => { this.unflatten(array, child) });
        }

        return tree;
    }

    getCommand(name: string, parent?: any): ICommandRegistration<ICommandConstructor> { return <any> _.filter(this.commands, parent ? { name, parent } : { name })[ 0 ] }

    getGroup(name: string, parent?: any): ICommandRegistration<IGroupConstructor> { return <any> _.filter(this.groups, parent ? { name, parent } : { name })[ 0 ] }

    addGroup(name: string, prettyName:string, cls: IGroupConstructor, desc: string = '', parent?: IGroupConstructor) { groups.push({ name, cls, prettyName, desc, parent, type: 'group' })}

    addCommand(name: string, prettyName:string, cls: ICommandConstructor, desc: string = '', parent?: IGroupConstructor) { commands.push({ name, prettyName, cls, desc, parent, type: 'command' })}
}
