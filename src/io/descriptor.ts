import { IOptionsDefinition, IArgumentsDefinition } from "../definitions";
import { IOutput } from "./output";
import { colors } from "@radic/console-colors";
import { BINDINGS, inject, injectable, IConfig, CommandsCli, ArgumentsCli } from "../core";
import { ICommandFactory, IResolvedRegistration } from "../commands/factory";
import { IGroup, IGroupConstructor } from "../commands/group";
import { ICommand, ICommandConstructor } from "../commands/command";

export interface IDescriptor
{
    cli(cli: any)

    getOptions(definition: IOptionsDefinition): CliTable;
    getArguments(definition: IArgumentsDefinition): CliTable;
    options(definition: IOptionsDefinition): this
    arguments(definition: IArgumentsDefinition): this

    group(group: string | IGroup): this
    command(command: ICommand): this

    getCommandTree(from?: string): any[]
    commandTree(label?: string, from?: string): this

}


@injectable()
export class Descriptor implements IDescriptor
{
    @inject(BINDINGS.OUTPUT)
    out: IOutput;

    @inject(BINDINGS.CONFIG)
    config: IConfig

    @inject(BINDINGS.COMMANDS_FACTORY)
    factory: ICommandFactory


    getCommandTree(from?: string): any[] {
        let f    = this.factory,
            c    = this.config('colors'),
            tree = f.getTree(),
            stop = false

        let mapNode: any = (node: IResolvedRegistration<IGroupConstructor|ICommandConstructor>): any => {
            if ( node.type === 'group' ) {
                return {
                    label: `{${c.group}}${node.name}{/reset} : {${c.description}}${node.desc}{reset}`,
                    nodes: node[ 'children' ] ? node[ 'children' ].map(mapNode) : []
                }
            }
            if ( node.type === 'command' ) {
                let command = this.factory.createCommand(<any> node);
                let args    = command.definition.getArguments()
                let keys    = Object.keys(args)

                return `{${c.command}}${node.name}{reset}` + (keys.length > 0 ? `{${c.argument}}${keys.map((name) => args[ name ]).join('{reset ')}{reset}` : '')
            }
        }

        return <any> tree.map(mapNode)
    }

    commandTree(label: string = 'Overview', from?: string): this {
        this.out.tree(`{${this.config('colors.header')}}${label}{reset}`, this.getCommandTree())
        return this
    }


    getGroup(group: IGroup | null): CliTable {
        let children = this.factory.getGroupChildren(group ? group.name : null, group ? group.parent : undefined)
        let table    = this.out.columns();
        children.forEach((child) => {
            let nameColor = colors.getTrucolorColor(this.config('colors.' + child.type)),
                name      = nameColor.in + child.name + nameColor.out,

                descColor = colors.getTrucolorColor(this.config('colors.description')),
                desc      = descColor.in + child.desc + descColor.out

            table.push([ name, desc ]);
        })

        return table
    }

    group(group: IGroup): this {
        this.out.writeln(this.getGroup(group).toString());
        return this
    }


    getCommand(command): string {
        return '';
    }

    command(command: ICommand): this {
        this.out.writeln(this.getCommand(command).toString());
        return this
    }


    getOptions(definition: IOptionsDefinition): CliTable {
        let opts  = definition.getJoinedOptions();
        let table = this.out.columns();
        Object.keys(opts).forEach((key: string) => {
            let keys    = [ '-' + key ]
            let aliases = definition.getOptions().alias[ key ] || []
            keys        = keys.concat(aliases.map((alias: string) => alias.length === 1 ? '-' + alias : '--' + alias))
            table.push([ keys.join('|'), opts[ key ].desc, `[{yellow}${opts[ key ].type}{/yellow}]` ])
        })
        return table
    }

    options(definition: IOptionsDefinition): this {
        this.out.writeln(this.getOptions(definition).toString());
        return this
    }


    getArguments(definition: IArgumentsDefinition): CliTable {
        return
    }

    arguments(definition: IArgumentsDefinition): this {
        this.out.writeln(this.getArguments(definition).toString());
        return this
    }

    protected argumentsCli(cli: ArgumentsCli) {

    }

    protected commandsCli(cli: CommandsCli) {
        let c = this.config


        // Title & Version
        if ( c('app.title') && c('descriptor.cli.showTitle') === true )
            this.out.write(`{${c('colors.title')}}${c('app.title')}{reset} `)

        if ( c('app.version') && c('descriptor.cli.showVersion') )
            this.out.write(`{${c('colors.subtitle')}}${c('app.version')}{reset} `)

        if ( c('app.description') && c('descriptor.cli.showDescription') )
            this.out.line().description(c('app.description'))


        let group         = this.getGroup(null);
        let options       = this.getOptions(cli.definition);
        let globalOptions = this.getOptions(cli.globalDefinition);
        let tree          = this.getCommandTree();

        this.out.line().header(c('descriptor.text.commands')).line(group.toString())
        this.out.line().header(c('descriptor.text.options')).line(options.toString())
        this.out.line().header(c('descriptor.text.globalOptions')).line(globalOptions.toString())
    }

    cli(cli: any) {
        // Let the CLI specific descriptions be handled by their respective methods
        if ( cli instanceof ArgumentsCli ) {
            this.argumentsCli(cli)
        } else if ( cli instanceof CommandsCli ) {
            this.commandsCli(cli)
        } else {
            throw new Error('CLI Tpp')
        }


    }

}
