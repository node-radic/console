
import { bindTo, container, inject } from '../../core/Container';
import { CommandConfig, HelpHelperOptionsConfig, OptionConfig } from '../../interfaces';
import { HelpHelper } from './HelpHelper';
import { OutputHelper } from '../output/OutputHelper';
import { ColumnsOptions } from '../output/interfaces';
import { stringify } from '@radic/util';

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