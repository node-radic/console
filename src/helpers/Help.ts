import { kindOf } from "@radic/util";
import { CommandConfig, HelperOptionsConfig, OptionConfig } from "../interfaces";
import { helper } from "../decorators";
import { CliExecuteCommandHandleEvent, CliExecuteCommandParseEvent } from "../core/Cli";
import { lazyInject } from "../core/Container";
import { Output } from "./Output";

@helper('help', {
    config: {
        option: {
            enabled: true,
            key    : 'h',
            name   : 'help'
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

    @lazyInject('cli.helpers.output')
    out: Output;

    public showHelp(config: CommandConfig, options: OptionConfig[]) {
        let name        = config.name,
            desc        = config.description,
            subCommands = config.subCommands.length ? 'Commands: \n' + config.subCommands.join('\n') : '',
            usage       = config.usage;

        desc  = desc && desc.length > 0 ? 'Description: ' + desc : ''
        usage = usage && usage.length > 0 ? 'Usage: \n' + usage : ''

        this.out.line(`
{bold}${name}{/bold}
${desc}
${usage}
${subCommands}

{bold}Options:{/bold}`)
        this.printOptions(options);
    }

    protected printOptions(options: OptionConfig[]) {
        let rows = [];
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
                if(remaining > 0){
                    result += desc.slice(desc.length - remaining, result.length + maxWidth)
                }
                desc = result;
            }

            // Format type
            let type:string = option.type
            if(type === undefined && option.count){
                type = 'count'
            }
            type = `[{yellow}${type}{/yellow}]`


            // Format key
            let name = option.name;
            let hasName = !! name;
            let key = '-' + option.key + (name ? '|--' + name : '');
            if(option.arguments > 0){

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
        console.log('onCommandParse')
        event.options.push({
            key        : this.config.option.key,
            name       : this.config.option.name,
            type       : 'boolean',
            description: 'show help'
        })
    }

    public onCommandHandle(event: CliExecuteCommandHandleEvent): void {
        console.log('onCommandHandle', event.argv, this.config.option, event.options)

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