import * as _ from "lodash";
import { kindOf, stringify } from "@radic/util";

import { CommandArgumentConfig, CommandConfig, HelperOptionsConfig, HelpHelperOptionsConfig, OptionConfig } from "../interfaces";
import { HelpHelperOnInvalidArgumentsShowHelpEvent, HelpHelperShowHelpEvent } from "./events";

import { helper } from "../decorators";
import { SubCommandsGetFunction } from "../utils";

import {
    CliExecuteCommandHandleEvent, CliExecuteCommandInvalidArgumentsEvent, CliExecuteCommandParseEvent,
    bindTo, container, inject,
    Log, Cli, Dispatcher
} from "../core";
import { OutputHelper } from "../modules/output/OutputHelper";
import { ColumnsOptions } from "../modules/output/interfaces";

@helper('help', {
    config   : {
        app               : {
            title: ''
        },
        addShowHelpCommand: true,
        showOnError       : true,
        option            : {
            enabled: false,
            key    : 'h',
            name   : 'help'
        },
        style             : {
            titleLines : 'darkorange',
            header     : 'darkorange bold',
            group      : 'darkcyan bold',
            grouped    : 'darkcyan bold',
            command    : 'steelblue',
            required   : 'green',
            description: 'darkslategray',
            desc       : '<%= helpers.help.style.description %>', // alias
            argument   : 'yellow darken 25',
            optional   : 'yellow darken 30',
            array      : 'cyan',
            type       : 'yellow'
        },
        templates         : {
            usage   : '{header}Usage:{/header}',
            treeItem: (config: CommandConfig, optionConfigs: OptionConfig[]) => `${config.name} ${config.arguments.map(arg => {
                let name = arg.name;

                return arg.required ? `<{argument}${name}{/argument}>` : `[{optional}${name}{/optional}]`

            }).join(' ')}`
        },
        order             : [
            'usage',
            'description',
            'explanation',
            'groups',
            'commands',
            'arguments',
            'options',
            'globalOptions',
            'example'
        ],
        headers           : {
            usage        : '{header}Usage: {/header}',
            description  : '{header}Description: {/header}\n',
            explanation  : '{header}Explanation: {/header}\n',
            groups       : '{header}Groups: {/header}\n',
            commands     : '{header}Commands: {/header}\n',
            arguments    : '{header}Arguments: {/header}\n',
            options      : '{header}Options: {/header}\n',
            globalOptions: '{header}Global options: {/header}\n',
            example      : '{header}Example: {/header}\n',
        },
        overrides         : {
            usage        : null,
            description  : null,
            explanation  : null,
            groups       : null,
            commands     : null,
            arguments    : null,
            options      : null,
            globalOptions: null,
            example      : null,
        },
        display           : {
            title             : true,
            titleLines        : true,
            explanation       : true,
            description       : true,
            descriptionAsTitle: false,
            usage             : true,
            usageOnGroups     : false,
            example           : true,
            arguments         : true,
            options           : true,
            globalOptions     : true,
            commands          : true,
            groups            : true
        }
    },
    listeners: {
        'cli:execute:parse'  : 'onCommandParse',
        'cli:execute:handle' : 'onCommandHandle',
        'cli:execute:invalid': 'onInvalidArguments'
    },
    depends  : [ 'output' ]
})
export class HelpHelper {
    config: HelpHelperOptionsConfig;

    @inject('cli.events')
    events: Dispatcher

    @inject('cli')
    cli: Cli

    @inject('cli.log')
    log: Log

    @inject('cli.helpers.output')
    out: OutputHelper;

    public get getSubCommands(): SubCommandsGetFunction { return container.get<SubCommandsGetFunction>('cli.fn.commands.get') }

    public createDescriber(command: CommandConfig): CommandDescriber {
        let describer     = container.get<CommandDescriber>('cli.helpers.help.describer')
        describer.command = command;
        return describer;
    }

    public showHelp(config: CommandConfig, options: OptionConfig[]) {
        if ( config.helpers[ 'help' ] ) {
            _.merge(this.config, config.helpers[ 'help' ]);
        }
        this.events.fire(new HelpHelperShowHelpEvent(config, options))
        let describer = this.createDescriber(config)
        this.config.order.forEach((item, i) => {
            if ( kindOf(this.config.overrides[ item ]) === 'function' ) {
                return this.config.overrides[ item ](config, describer, this);
            }
            describer[ item ]()
        })
    }

    public onCommandParse(event: CliExecuteCommandParseEvent) {
        if ( this.config.option.enabled === true ) {
            event.cli.global(this.config.option.key, {
                name       : this.config.option.name,
                type       : 'boolean',
                description: 'show help'
            })
        }

    }

    public onCommandHandle(event: CliExecuteCommandHandleEvent): void {
        if ( this.config.addShowHelpCommand ) {
            this.out.styles(this.config.style);
            event.instance[ 'showHelp' ] = () => {
                this.showHelp(event.config, event.options)
            };
            if ( event.argv[ this.config.option.key ] ) {
                this.events.emit('help:' + event.config.name)
                if ( kindOf(event.instance[ 'help' ]) === 'function' ) {
                    event.instance[ 'help' ].apply(event.instance, [ event.config, event.options ]);
                    return event.exit();
                }
                this.showHelp(event.config, event.options);
                return event.exit();
            }
        }
    }

    public onInvalidArguments(event: CliExecuteCommandInvalidArgumentsEvent) {
        if ( this.config.showOnError === true && event.config.onMissingArgument === 'help' ) {
            if ( this.events.fire(new HelpHelperOnInvalidArgumentsShowHelpEvent(event)).stopIfExit().isCanceled() ) return
            this.showHelp(event.config, event.options);
            this.out.nl;
            for ( let m in event.parsed.missing ) {
                this.log.error(`Missing required argument <${event.parsed.missing[ m ]}>`)
            }
            return event.exit();
        }
    }

}

container.bind('cli.helpers.help.describer.factory').toFactory((ctx) => {
    return async (command: CommandConfig) => {
        const describer   = ctx.container.get<CommandDescriber>('cli.helpers.help.describer')
        describer.command = command;
        return describer;
    }
})

@bindTo('cli.helpers.help.describer')
export class CommandDescriber {
    public command: CommandConfig = null;

    @inject('cli.helpers.help')
    protected help: HelpHelper

    @inject('cli.helpers.output')
    protected out: OutputHelper

    protected get config(): HelpHelperOptionsConfig {
        return this.help.config;
    }

    protected get display() {
        return this.config.display;
    }

    get nl(): this {
        this.write('\n')
        return this;
    }

    write(text: string): this {
        this.out.write(text)
        return this;
    }

    line(text: string = ''): this {
        this.out.line(text)
        return this;
    }

    protected columns(data: any, options: ColumnsOptions  = {}): this {
        return this.write(this.out.columns(data, options, true))
    }

    usage(): this {
        if ( ! this.display.usage ) return this;
        let config = this.command,
            usage  = config.usage || '',
            name   = config.name
        if ( usage.length === 0 && config.arguments.length > 0 ) {
            usage = this.help.cli.parsedCommands.map(cmd => cmd.name).join(' ');
            usage += ' '
            usage += config.arguments.map(arg => {
                name = arg.name + (arg.alias ? '|' + arg.alias : '')
                return arg.required ? '<' + name + '>' : '[' + name + ']'
            }).join(' ')
        }
        usage += ' [...options]'
        return this.write(this.config.headers.usage).write(usage).nl.nl
    }

    arguments(): this {
        if ( this.command.isGroup || ! this.display.arguments || this.command.arguments.length === 0 ) return this;
        let rows = []
        this.command.arguments.forEach(arg => {
            let row  = [];
            let name = [
                arg.required ? '<' : '[',
                arg.name,
                arg.alias ? '|' + arg.alias : '',
                arg.required ? '>' : ']',
            ].join('');
            row.push(name)

            row.push(arg.description || '')

            let type = [
                '[',
                arg.variadic ? '{array}Array<{/array}' : '',
                `{type}${arg.type !== undefined ? arg.type : 'string'}{/type}`,
                arg.variadic ? '{array}>{/array}' : '',
                ']'
            ].join('')

            if ( arg.required ) {
                type += ' [{required}required{/required}]'
            }
            row.push(type)
            rows.push(row); //[ arg.name, arg.desc, arg.type, arg.variadic, arg.required ])
        })
        if ( rows.length === 0 ) return this;
        return this.write(this.config.headers.arguments).columns(rows, {
            columnSplitter  : '  ',
            showHeaders     : false,
            preserveNewLines: true
        }).nl.nl
    }

    commands(): this {
        if ( ! this.command.isGroup || ! this.display.commands ) return this;
        let rows = []
        this.help.getSubCommands<CommandConfig[]>(this.command.filePath, false, true).forEach(command => {
            let type = command.isGroup ? 'grouped' : 'command';
            if ( command.isGroup ) return;
            rows.push([ `{command}${command.name}{/command}`, `{desc}${command.description}{/desc}` ]);

        })
        if ( rows.length === 0 ) return this;
        return this.write(this.config.headers.commands).columns(rows, {
            columnSplitter  : '   ',
            showHeaders     : false,
            preserveNewLines: true
        }).nl.nl
    }

    groups(): this {
        if ( ! this.command.isGroup || ! this.display.commands ) return this;

        let rows = []
        this.help.getSubCommands<CommandConfig[]>(this.command.filePath, false, true).forEach(command => {
            if ( ! command.isGroup ) return;
            rows.push([ `{grouped}${command.name}{/grouped}`, `{desc}${command.description}{/desc}` ]);

        })
        if ( rows.length === 0 ) return this;
        return this.write(this.config.headers.groups).columns(rows, {
            columnSplitter  : '   ',
            showHeaders     : false,
            preserveNewLines: true
        }).nl.nl
    }

    globalOptions(): this {
        if ( ! this.display.globalOptions || this.help.cli[ 'globalOptions' ].length === 0 ) return this;
        return this.write(this.config.headers.globalOptions).printOptions(this.help.cli[ 'globalOptions' ]).nl.nl
    }

    options(): this {
        if ( ! this.display.options || this.command.options.length === 0 ) return this;
        return this.write(this.config.headers.options).printOptions(this.command.options).nl.nl
    }

    description(): this {
        if ( ! this.display.description || this.command.description.length === 0 ) return this;
        return this.write(this.config.headers.description).write(this.command.description).nl.nl
    }

    explanation(): this {
        if ( ! this.display.explanation || ! this.command.explanation ) return this;

        return this.write(this.config.headers.explanation).write(this.command.explanation).nl.nl
    }

    example(): this {
        if ( ! this.display.example || ! this.command.example ) return this;
        return this.write(this.config.headers.example).write(this.command.example).nl.nl
    }

    protected printOptions(options: OptionConfig[]): this {
        let rows = [];

        let s = this.help.config.styles
        options.forEach(option => {
            // Format description
            let desc: string = option.description;
            let maxWidth     = 50;
            if ( desc && desc.length > maxWidth ) {
                let remaining = desc.length
                let result    = '';
                while ( remaining > maxWidth ) {
                    result += desc.slice(desc.length - remaining, result.length + maxWidth) + '\n';
                    remaining -= maxWidth;
                }
                if ( remaining > 0 ) {
                    result += desc.slice(desc.length - remaining, result.length + maxWidth)
                }
                desc = result;
            }


            // Format type
            let type: string = option.type
            if ( type === undefined && option.count ) {
                type = 'count'
            }
            type = `{type}${type}{/type}`
            if ( option.array ) {
                type = `{cyan}Array<{/cyan}${type}{cyan}>{/cyan}`
            }
            if ( option.default ) {
                type += '=' + stringify(option.default)
            }
            type = '[' + type + ']';


            // Format key
            let name    = option.name;
            let hasName = ! ! name;
            let key     = '-' + option.key + (name ? '|--' + name : '');
            if ( option.arguments > 0 ) {
            }
            if ( option.default ) {
                // type = `[default=${JSON.stringify(option.default)}] ${type}`
            }

            let columns = [
                key,
                desc,
                type
            ]
            rows.push(columns);
        })
        return this.columns(rows, {
            columnSplitter  : '   ',
            showHeaders     : false,
            preserveNewLines: true
        })

    }

}