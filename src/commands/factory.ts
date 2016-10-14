import * as Promise from 'bluebird'
import { injectable, app, CommandsCli, BINDINGS } from "../core";
import { Command, ICommandConstructor } from "./command";
import { Group, IGroupConstructor } from "./group";
import * as _ from "lodash";


export interface ICommandRegistration<T>
{
    name: string
    desc: string
    parent?: IGroupConstructor
    cls?: T
    type?: 'group' | 'command'
    showHelp ?:() => void
    toString ?:() => string
}

export interface IResolvedRegistration<T> extends ICommandRegistration<T>
{
    arguments: string[]
    hasArguments: boolean
    tree: any
}

let groups: ICommandRegistration<IGroupConstructor>[]     = []
let commands: ICommandRegistration<ICommandConstructor>[] = []

export function command(name: string, desc: string = '', parent: IGroupConstructor = null) {
    return (cls: ICommandConstructor) => {
        commands.push({ name, cls, desc, parent, type: 'command' })
    }
}

export function group(name: string, desc: string = '', parent: IGroupConstructor = null) {
    return (cls: IGroupConstructor) => {
        groups.push({ name, cls, desc, parent, type: 'group' })
    }
}
export interface ICommandFactory
{

    groups: ICommandRegistration<IGroupConstructor>[]
    commands: ICommandRegistration<ICommandConstructor>[]


    addGroup(name: string, cls: IGroupConstructor, desc?: string, parent?: IGroupConstructor)
    addCommand(name: string, cls: ICommandConstructor, desc?: string, parent?: IGroupConstructor)

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
    resolveFromString(str:string):IResolvedRegistration<IGroupConstructor|ICommandConstructor>
}

export abstract class BaseCommandRegistration {


    private defer: Promise.Resolver<any>;
    protected asyncMode: boolean = false;

    fire() {
        this.defer = Promise.defer();
        this.parse();
        // let handle = this.handler || this['handle'];
        this[ 'handle' ].apply(this);
        if ( false === this.asyncMode ) {
            this.done();
        }
        return this.defer.promise;
    }

    protected async() {
        this.asyncMode = true;
        return this.done;
    }

    protected done() { this.defer.resolve(this); }

    protected fail(reason?: string) { this.defer.reject(reason); }

    protected parse(){}

}

@injectable()
export class CommandFactory implements ICommandFactory
{
    get groups() { return groups }

    get commands() { return commands }

    getGroupChildren(name: string, parent?: any): ICommandRegistration<ICommandConstructor|IGroupConstructor>[] {
        let groupRegistration = this.getGroup(name, parent)

        return commands.concat(<ICommandRegistration<any>[]> groups)
            .filter((item: ICommandRegistration<any>) => {
                return item.parent === (groupRegistration ? groupRegistration.cls : null)
            })
    }

    createCommand(commandRegistration, argv=[]): Command {
        let command: Command = app.make<Command>(commandRegistration.cls);

        command.argv = argv
        command.definition.mergeOptions(app.get<CommandsCli>(BINDINGS.CLI).getGlobalDefinition());
        command.definition.arguments(command.arguments);
        command.definition.options(command.options);

        command.name = commandRegistration.name;
        command.desc = commandRegistration.desc
        command.parent = commandRegistration.parent ? commandRegistration.parent : null

        return command;
    }

    createGroup(groupRegistration): Group {
        let group  = app.make<Group>(groupRegistration.cls);
        group.name = groupRegistration.name
        group.desc = groupRegistration.desc
        group.parent = groupRegistration.parent ? groupRegistration.parent : null
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

    addGroup(name: string, cls: IGroupConstructor, desc: string = '', parent?: IGroupConstructor) { groups.push({ name, cls, desc, parent, type: 'group' })}

    addCommand(name: string, cls: ICommandConstructor, desc: string = '', parent?: IGroupConstructor) { commands.push({ name, cls, desc, parent, type: 'command' })}
}
