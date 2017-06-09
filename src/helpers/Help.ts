import { kindOf } from "@radic/util";
import { CommandArgumentConfig, CommandConfig, HelperOptionsConfig, OptionConfig } from "../interfaces";
import { helper } from "../decorators";
import { Cli, CliExecuteCommandHandleEvent, CliExecuteCommandParseEvent } from "../core/Cli";
import { lazyInject } from "../core/Container";
import { Output } from "./Output";
import { findSubCommandFilePath } from "../utils";

@helper('help', {
    config: {
        option : {
            enabled: true,
            key    : 'h',
            name   : 'help'
        },
        style  : {

            header     : 'darkorange bold',
            group      : 'steelblue bold',
            command    : 'darkcyan',
            description: 'darkslategray',
            desc       : '<%= helpers.help.style.description %>', // alias
            argument   : 'yellow darken 25',
            optional   : 'yellow',
            type       : 'yellow'
        },
        display: {
            description  : true,
            usage        : true,
            example      : true,
            subCommands  : true,
            options      : true,
            globalOptions: true
        }
    },

    listeners: {
        'cli:execute:parse' : 'onCommandParse',
        'cli:execute:handle': 'onCommandHandle'
    },

    depends: [ 'output' ]
})
export class Help {
    config: HelperOptionsConfig;

    @lazyInject('cli')
    cli: Cli

    @lazyInject('cli.helpers.output')
    out: Output;

    public showHelp(config: CommandConfig, options: OptionConfig[]) {
        let name    = config.name,
            desc    = config.description || '',
            example = config.example || '',
            usage   = config.usage || '';


        this.out.nl.line(`{title}${name}\n${'-'.repeat(name.length)}{/title}`)

        if ( this.config.display.description && desc.length > 0 ) {
            this.out.line(desc); //line('{group}Description:{/group}')
        }
        if ( this.config.display.usage ) {
            if ( usage.length === 0 && config.arguments.length > 0 ) {
                usage = config.name + ' ' + config.arguments.map(arg => arg.required ? '<' + arg.name + '>' : '[' + arg.name + ']').join(' ')
            }
            if ( usage.length > 0 ) {
                this.out.nl.line('{header}Usage:{/header}').line(usage);
            }
        }
        if ( this.config.display.example && example.length > 0 ) {
            this.out.nl.line('{header}Example:{/header}').line(example);
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
    }

    protected printArguments(args:CommandArgumentConfig[] = []){
        let rows = []
        args.forEach(arg => {
            // arg.
        })
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

    public onCommandParse(event: CliExecuteCommandParseEvent) {
        event.cli.global(this.config.option.key, {
            name       : this.config.option.name,
            type       : 'boolean',
            description: 'show help'
        })
    }

    public onCommandHandle(event: CliExecuteCommandHandleEvent): void {
        this.out.styles(this.config.style);
        if ( event.argv[ this.config.option.key ] ) {
            if ( kindOf(event.instance[ 'help' ]) === 'function' ) {
                event.instance[ 'help' ].apply(event.instance, [ event.config, event.options ]);
                return event.stop();
            }
            this.showHelp(event.config, event.options);
            return event.stop();
        }
    }
}