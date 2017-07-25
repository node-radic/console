import { kindOf } from "@radic/util";
import { CommandArgumentConfig, CommandConfig, HelperOptionsConfig, OptionConfig } from "../interfaces";
import { helper } from "../decorators";
import { CliExecuteCommandHandleEvent, CliExecuteCommandInvalidArgumentsEvent, CliExecuteCommandParseEvent } from "../core/events";
import { inject } from "../core/Container";
import { OutputHelper } from "./Output";
import { getSubCommands } from "../utils";
import { Log } from "../core/Log";
import { Cli } from "../core/Cli";
import { Dispatcher } from "../core/Dispatcher";
import { HelpHelperOnInvalidArgumentsShowHelpEvent, HelpHelperShowHelpEvent } from "./events";
import * as _ from "lodash";

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
            grouped    : '<%= helpers.help.style.group %>',
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
    depends  : [ 'output' ]
})
export class CommandDescriptionHelper {
    config: HelperOptionsConfig;

    @inject('cli.events')
    events: Dispatcher

    @inject('cli')
    cli: Cli

    @inject('cli.log')
    log: Log

    @inject('cli.helpers.output')
    out: OutputHelper;

    public showHelp(config: CommandConfig, options: OptionConfig[]) {
        if ( config.helpers[ 'help' ] ) {
            _.merge(this.config, config.helpers[ 'help' ]);
        }
        this.events.fire(new HelpHelperShowHelpEvent(config, options))
        this.printHelp(config, options);
    }

    protected printHelp(config: CommandConfig, options: OptionConfig[]) {
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
                this.out.nl.line(this.config.templates.usage).line(usage);
            }
        }
        if ( this.config.display.arguments && config.arguments.length > 0 ) {
            this.out.nl.line('{header}Arguments:{/header}');
            this.printArguments(config.arguments);
        }
        if ( this.config.display.subCommands && config.isGroup ) {
            this.out.nl.line('{header}Commands:{/header}');
            this.printSubCommands(config);
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
            let row  = [];
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
            //
            // let row = [
            //     name,
            //     arg.desc,
            //     type
            // ]

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

    protected printSubCommands(config: CommandConfig) {
        let rows                                   = []
        let groups: { [name: string]: string[][] } = {}
        getSubCommands<CommandConfig[]>(config.filePath, false, true).forEach(command => {
            let desc                          = '',
                name                          = null,
                args: CommandArgumentConfig[] = [];

            desc = command.description;
            name = command.name
            args = command.arguments

            let type = command.isGroup ? 'grouped' : 'command';
            let line = [ `{${type}}${command.name}{/${type}}`, `{desc}${desc}{/desc}` ];

            if ( command.group ) {
                if ( ! groups[ command.group ] ) groups[ command.group ] = []
                groups[ command.group ].push(line)
            } else {
                rows.push(line)
            }
        })
        // findSubCommandsPaths(config.filePath).forEach(modulePath => {
        //     let desc                          = '',
        //         name                          = null,
        //         args: CommandArgumentConfig[] = [];
        //
        //     let module = require(modulePath);
        //     if ( kindOf(module.default) === 'function' ) {
        //         let command: CommandConfig = Reflect.getMetadata('command', module.default);
        //
        //         desc = command.description;
        //         name = command.name
        //         args = command.arguments
        //         // let sub = ' '
        //         // if(config.subCommands && config.subCommands.length > 0){
        //         //     sub = config.subCommands.map(subCommand => `{command}${subCommand}{/command}\n`).join('')
        //         // }
        //
        //         let type = command.isGroup ? 'grouped' : 'command';
        //         let line = [ `{${type}}${command.name}{/${type}}`, `{desc}${desc}{/desc}` ];
        //
        //         if ( command.group ) {
        //             if ( ! groups[ command.group ] ) groups[ command.group ] = []
        //             groups[ command.group ].push(line)
        //         } else {
        //             rows.push(line)
        //         }
        //     }
        // })
        this.out.columns(rows, {
            columnSplitter  : '   ',
            showHeaders     : false,
            preserveNewLines: true
        })
        Object.keys(groups).forEach(group => {
            this.out.nl.line(`{orange}${group} commands:{/orange}`)
            this.out.columns(groups[ group ], {
                columnSplitter  : '   ',
                showHeaders     : false,
                preserveNewLines: true
            })
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
        this.out.columns(rows, {
            columnSplitter  : '   ',
            showHeaders     : false,
            preserveNewLines: true
        })

    }

    public printCommandTree(label: string = 'Command tree:', config?: CommandConfig) {

        this.out.tree(label, this.getTreeSubcommands(this.cli.rootCommand || config || {}))
    }

    protected getTreeSubcommands(config: CommandConfig): any[] {
        let obj = getSubCommands(config.filePath);
        return Object.keys(obj).map(subCommand => {
            // let filePath                 = obj[ subCommand ].filePath
            // let subConfig: CommandConfig = obj[ subCommand ];
            //
            // let optionConfigs: OptionConfig[] = Reflect.getMetadata('options', subConfig.cls.prototype) || [];
            // if ( subConfig.isGroup ) {
            //     subConfig.subCommands = Object.keys(getSubCommands(config.filePath))
            // }
            // if ( subConfig.subCommands && subConfig.subCommands.length > 0 ) {
            //     return { label: this.config.templates.treeItem(subConfig, optionConfigs), nodes: this.getTreeSubcommands(subConfig) }
            // }
            return this.config.templates.treeItem(subCommand, Reflect.getMetadata('options', subCommand[ 'cls' ].prototype))

        })
    }

    getSubcommandsNameTree(config: CommandConfig): any {
        let obj = {};
        //
        // config.subCommands.map(subCommand => {
        //     let filePath = findSubCommandFilePath(subCommand, config.filePath)
        //     let module   = require(filePath);
        //     if ( kindOf(module.default) === 'function' ) {
        //         let subConfig: CommandConfig      = Reflect.getMetadata('command', module.default);
        //         let optionConfigs: OptionConfig[] = Reflect.getMetadata('options', subConfig.cls.prototype) || [];
        //         if ( subConfig.subCommands && subConfig.subCommands.length > 0 ) {
        //             return { [subConfig.name]: this.getSubcommandsNameTree(subConfig) }
        //         }
        //
        //         return { [subConfig.name]: optionConfigs.map(opt => '--' + opt.name) };
        //     }
        //     return false;
        // }).filter(subConfig => subConfig !== false).forEach(subj => {
        //     _.merge(obj, subj);
        // });
        return obj
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

    public onInvalidArguments(event: CliExecuteCommandInvalidArgumentsEvent) {
        if ( this.config.showOnError === true && event.config.onMissingArgument === 'help' ) {
            if ( this.events.fire(new HelpHelperOnInvalidArgumentsShowHelpEvent(event)).halt ) return
            this.showHelp(event.config, event.options);
            this.out.nl;
            for ( let m in event.parsed.missing ) {
                this.log.error(`Missing required argument <${event.parsed.missing[ m ]}>`)
            }
            return event.stop();
        }
    }

}