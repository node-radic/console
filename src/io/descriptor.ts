import { IOptionsDefinition, IArgumentsDefinition } from "../definitions";
import { IOutput } from "./output";
import { BINDINGS, inject, injectable, IConfig, CommandsCli, ArgumentsCli } from "../core";
import { ICommandFactory, IResolvedRegistration } from "../commands/factory";
import { IGroup, IGroupConstructor } from "../commands/group";
import { ICommand, ICommandConstructor } from "../commands/command";

export interface IDescriptor {
    cli(cli: any)

    getOptions(definition: IOptionsDefinition): CliTable;
    getArguments(definition: IArgumentsDefinition): CliTable;
    options(definition: IOptionsDefinition): this
    arguments(definition: IArgumentsDefinition): this

    getGroup(group): CliTable
    group(group: string | IGroup): this
    getCommand(command): {args: CliTable,options: CliTable,usage: string, example: string}
    command(command: ICommand): this

    getCommandTree(from?: string): any[]
    commandTree(label?: string, from?: string): this

    getExample(definition: IOptionsDefinition): string
    example(definition: IOptionsDefinition): this

    getUsage(definition: IOptionsDefinition): string
    usage(definition: IOptionsDefinition): this

}


@injectable()
export class Descriptor implements IDescriptor {
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
                    label: `{group}${node.name}{/group} : {description}${node.desc}{/description}`,
                    nodes: node[ 'children' ] ? node[ 'children' ].map(mapNode) : []
                }
            }
            if ( node.type === 'command' ) {
                let command = this.factory.createCommand(<any> node);
                let args    = command.definition.getArguments()
                let names   = Object.keys(args)

                let out = `{command}${node.name}{/command} ` // : {${c.description}}${node.desc}{reset}`

                out += names.map((name) => {
                    let arg = args[name]
                    let  out = arg.name


                    if(arg.default)
                        out += '=' + arg.default

                    if(arg.required === true)
                        return '[' + out + ']'
                    else
                        return '{dimgray}<' + out + '>{/dimgray}'


                }).join(' ')

                return out;

                // (keys.length > 0 ? `{${c.argument}}${keys.map((name) => args[ name ]).join('{reset} ')}{reset}` : '')
            }
        }

        return <any> tree.map(mapNode)
    }

    commandTree(label: string = 'Overview', from?: string): this {

        this.out.tree(`{header}${label}{/header}`, this.getCommandTree())
        return this
    }


    getGroup(group: IGroup | null): CliTable {
        let children = this.factory.getGroupChildren(group ? group.name : null, group ? group.parent : undefined)
        let table    = this.out.columns();
        children.forEach((child) => {
            table.push([ `{${child.type}}${child.name}{/${child.type}}`, `{description}${child.desc}{/description}` ]);
        })

        return table
    }

    group(group: IGroup): this {
        this.out.line(this.getGroup(group).toString());
        return this
    }


    getCommand(command): {args: CliTable,options: CliTable,usage: string, example: string} {
        let args    = this.getArguments(command.definition),
            options = this.getOptions(command.definition),
            usage   = this.getUsage(command.definition),
            example = this.getExample(command.definition)

        return { args, options, usage, example };
    }

    command(command: ICommand): this {
        let c                                 = this.config,
            { args, options, usage, example } = this.getCommand(command)

        if ( usage ) this.out.line().header(c('descriptor.text.usage')).line(usage)
        this.out.line().header(c('descriptor.text.arguments')).line(args.toString())
        if ( options.length ) this.out.line().header(c('descriptor.text.options')).line(options.toString())
        if ( example ) this.out.line().header(c('descriptor.text.example')).line(example)

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
        this.out.line(this.getOptions(definition).toString());
        return this
    }


    getArguments(definition: IArgumentsDefinition): CliTable {
        let args  = definition.getArguments();
        let table = this.out.columns();

        Object.keys(args).forEach((name: string) => {
            let arg: any  = args[ name ];
            table.push([ `{argument}${name}{/argument}`, `{description}${arg.desc}{/description}`, arg.required ? '[{required}required{/required}]' : '' ]);
        })
        return table;
    }

    arguments(definition: IArgumentsDefinition): this {
        this.out.line(this.getArguments(definition).toString());
        return this
    }

    getExample(definition: IOptionsDefinition): string {
        return definition.getExample();
    }

    example(definition: IOptionsDefinition): this {
        this.out.line(this.getExample(definition))
        return this;
    }

    getUsage(definition: IOptionsDefinition): string {
        return definition.getUsage()
    }

    usage(definition: IOptionsDefinition): this {
        this.out.line(this.getUsage(definition))
        return this;
    }

    protected argumentsCli(cli: ArgumentsCli) {

    }

    protected commandsCli(cli: CommandsCli) {
        let c = this.config

        // this.out['setUseParser'](false)

        // Title & Version
        if ( c('app.title') && c('descriptor.cli.showTitle') === true )
            this.out.write(`{title}${c('app.title')}{/title} `)

        if ( c('app.version') && c('descriptor.cli.showVersion') )
            this.out.write(`{subtitle}${c('app.version')}{/subtitle}`)

        if ( c('app.description') && c('descriptor.cli.showDescription') )
            this.out.line().write(`{description}${c('app.description')}{/description}`)

        this.out.line().line()

        let group         = this.getGroup(null);
        let options       = this.getOptions(cli.definition);
        let globalOptions = this.getOptions(cli.globalDefinition);
        let tree          = this.getCommandTree();

        this.out.line(`{header}${c('descriptor.text.commands')}{/header}`).line(group.toString()).line()
        this.out.line(`{header}${c('descriptor.text.options')}{/header}`).line(options.toString()).line()
        this.out.line(`{header}${c('descriptor.text.globalOptions')}{/header}`).line(globalOptions.toString()).line()
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
