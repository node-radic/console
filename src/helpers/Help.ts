import { kindOf } from "@radic/util";
import { CommandArgumentConfig, CommandConfig, HelperOptionsConfig, OptionConfig } from "../interfaces";
import { helper } from "../decorators";
import { CliExecuteCommandHandleEvent, CliExecuteCommandInvalidArguments, CliExecuteCommandParseEvent } from "../core/events";
import { lazyInject } from "../core/Container";
import { OutputHelper } from "./Output";
import { findSubCommandFilePath } from "../utils";
import { Log } from "../core/log";
import { Cli } from "../core/Cli";
import { Dispatcher } from "../core/Dispatcher";

@helper('help', {
    config: {
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
            group      : 'steelblue bold',
            command    : 'darkcyan',
            required   : 'green',
            description: 'darkslategray',
            desc       : '<%= helpers.help.style.description %>', // alias
            argument   : 'yellow darken 25',
            optional   : 'yellow',
            array      : 'cyan',
            type       : 'yellow'
        },
        display           : {
            title             : true,
            titleLines        : true,
            description       : true,
            descriptionAsTitle: true,
            usage             : true,
            example           : true,
            arguments         : true,
            subCommands       : true,
            options           : true,
            globalOptions     : true
        }
    },
    listeners: {
        'cli:execute:parse'  : 'onCommandParse',
        'cli:execute:handle' : 'onCommandHandle',
        'cli:execute:invalid': 'onInvalidArguments'
    },
    depends: [ 'output' ]
})
export class CommandDescriptionHelper {
    config: HelperOptionsConfig;

    @lazyInject('cli.events')
    events: Dispatcher

    @lazyInject('cli')
    cli: Cli

    @lazyInject('cli.log')
    log: Log

    @lazyInject('cli.helpers.output')
    out: OutputHelper;

    public showHelp(config: CommandConfig, options: OptionConfig[]) {
        let name    = config.name,
            desc    = config.description || '',
            example = config.example || '',
            usage   = config.usage || '';


        this.printTitle(config);

        if ( this.config.display.description && ! this.config.display.descriptionAsTitle && config.description.length > 0 ) {
            this.out.line(config.description); //line('{group}Description:{/group}')
        }

        if ( this.config.display.explenation && config.explenation.length > 0 ) {
            this.out.line(config.explenation)
        }

        if ( this.config.display.usage ) {
            if ( usage.length === 0 && config.arguments.length > 0 ) {
                usage = this.getParsedCommandNames().join(' ');
                usage += ' '
                usage += config.arguments.map(arg => {
                    name = arg.name + (arg.alias ? '|' + arg.alias : '')
                    return arg.required ? '<' + name + '>' : '[' + name + ']'
                }).join(' ')
            }
            if ( usage.length > 0 ) {
                this.out.nl.line('{header}Usage:{/header}').line(usage);
            }
        }
        if ( this.config.display.arguments && config.arguments.length > 0 ) {
            this.out.nl.line('{header}Arguments:{/header}');
            this.printArguments(config.arguments);
        }
        if ( this.config.display.subCommands && config.subCommands.length > 0 ) {
            this.out.nl.line('{header}Commands:{/header}');
            this.printSubCommands(config.subCommands);
        }
        if ( this.config.display.options && options.length > 0 ) {
            this.out.nl.line('{header}Options:{/header}')
            this.printOptions(options);
        }
        if ( this.config.display.globalOptions ) {
            this.out.nl.line('{header}Global options:{/header}')
            this.printGlobalOptions();
        }
        if ( this.config.display.example && example.length > 0 ) {
            this.out.nl.line('{header}Examples:{/header}').line(example);
        }
    }

    protected printArguments(args: CommandArgumentConfig[] = []) {
        let rows = []
        args.forEach(arg => {
            let row = []
            let name = [
                arg.required ? '<' : '[',
                arg.name,
                arg.alias ? '|' + arg.alias : '',
                arg.required ? '>' : ']',
            ].join('');
            row.push(name)

            row.push(arg.desc || '')

            let type = [
                '[',
                arg.variadic ? '{array}Array<{/array}' : '',
                `{type}${arg.type !== undefined ? arg.type : 'string'}{/type}`,
                arg.variadic ? '{array}>{/array}' : '',
                ']'
            ].join('')
            row.push(type)

            if ( arg.required ) {
                type += ' [{required}required{/required}]'
            }

            let row = [
                name,
                arg.desc,
                type
            ]

            rows.push(row); //[ arg.name, arg.desc, arg.type, arg.variadic, arg.required ])
        })
        this.out.columns(rows, {
            columnSplitter  : '  ',
            showHeaders     : false,
            preserveNewLines: true
        })
    }

    protected printTitle(config: CommandConfig) {
        let title = config.name;
        // check if root command
        if ( this.cli.rootCommand.cls === config.cls ) {
            title = this.config.app.title || config.name;
        } else if ( this.config.display.descriptionAsTitle && config.description.length > 0 ) {
            title = config.description; //line('{group}Description:{/group}')
        }
        if ( this.config.display.title ) {
            this.out.nl.line(`{title}${title}{/title}`)
            if ( this.config.display.titleLines ) {
                this.out.line(`{titleLines}${'-'.repeat(title.length)}{/titleLines}`)
            }
        }

    }

    protected printSubCommands(subCommands: string[]) {
        let rows = []
        subCommands.forEach(command => {
            let desc                          = '',
                name                          = null,
                args: CommandArgumentConfig[] = [];

            let filePath = findSubCommandFilePath(command, this.cli.runningCommand.filePath)
            let module   = require(filePath);
            if ( kindOf(module.default) === 'function' ) {
                let config: CommandConfig = Reflect.getMetadata('command', module.default);
                desc                      = config.description;
                name                      = config.name
                args                      = config.arguments
                // args.filter(arg => arg.required).map(arg => arg.name);
                rows.push([ `{command}${config.name}{/command}`, `{desc}${desc}{/desc}` ]);
            }

        })
        this.out.columns(rows, {
            columnSplitter  : '   ',
            showHeaders     : false,
            preserveNewLines: true
        })
    }

    protected printGlobalOptions() {
        this.printOptions(this.cli[ 'globalOptions' ]);
    }

    protected printOptions(options: OptionConfig[]) {
        let rows = [];
        let s    = this.config.styles
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
            type = '[' + type + ']';

            // Format key
            let name    = option.name;
            let hasName = ! ! name;
            let key     = '-' + option.key + (name ? '|--' + name : '');
            if ( option.arguments > 0 ) {

            }

            let columns = [
                key,
                desc,
                type
            ]
            rows.push(columns);
        })
        this.out.columns(rows, {
            columnSplitter  : '   ',
            showHeaders     : false,
            preserveNewLines: true
        })

    }

    protected getParsedCommandNames(): string[] {
        return this.cli.parsedCommands.map(cmd => {
            return cmd.name
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
        if ( this.config.addShowHelpFunction ) {
            this.out.styles(this.config.style);
            event.instance[ 'showHelp' ] = () => {
                this.showHelp(event.config, event.options)
            };
            if ( event.argv[ this.config.option.key ] ) {
                this.events.emit('help:' + event.config.name)
                if ( kindOf(event.instance[ 'help' ]) === 'function' ) {
                    event.instance[ 'help' ].apply(event.instance, [ event.config, event.options ]);
                    return event.stop();
                }
                this.showHelp(event.config, event.options);
                return event.stop();
            }
        }
    }

    public onInvalidArguments(event: CliExecuteCommandInvalidArguments) {
        if ( this.config.showOnError === true && event.config.onMissingArgument === 'help' ) {
            this.showHelp(event.config, event.options);
            this.out.nl;
            for (let m in event.parsed.missing) {
                this.log.error(`Missing required argument <${event.parsed.missing[ m ]}>`)
            }
            return event.stop();
        }
    }
}