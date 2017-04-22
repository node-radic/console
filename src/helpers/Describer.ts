import { merge } from "lodash";
import { Container, inject } from "../core/Container";
import { interfaces as i } from "../interfaces";
import { helper } from "../decorators";
import { Output } from "./Output";
import { Registry } from "../core/Registry";
import { kindOf } from "@radic/util";
import { ParsedNode } from "../parser/ParsedNode";
import { prepareOption } from "../utils";
import { CliParseEvent } from "../core/Cli";

export type DescribedOptionsArray = Array<{ keys: string[], desc: string, type: string }>

export interface DescribedOptions {
    local: DescribedOptionsArray
    global: DescribedOptionsArray
    getLocal(): string
    getGlobal(): string
    toString(): string
}

@helper('describer', {
    config   : {
        helpOption: {
            enabled: false,
            keys   : [ 'h', 'help' ]
        },
        styles    : {
            optionKeys         : '#999',
            optionKeysSeperator: '#ff6a4d',
            optionDesc         : 'orange',
            optionType         : 'yellow',
            optionArrayType    : 'cyan bold'
        }
    },
    listeners: {
        'cli:parse'         : 'onParse',
        'cli:parsed'        : 'onParsed',
        'cli:resolve:root'  : 'onResolveRoot',
        'cli:resolve:parsed': 'onResolveParsed'
    }
})
export class Describer {
    config: any;

    constructor(@inject('console.helpers.output') protected out: Output) {}

    protected get registry(): Registry {
        return Container.getInstance().make<Registry>('console.registry');
    }

    protected columns(data: any, options: i.OutputColumnsOptions = {}): string {
        return this.out.columns(data, merge({
            columnSplitter: '   ',
            showHeaders   : false
        }, options), true);
    }

    options(options: { [name: string]: i.OptionConfig }): DescribedOptions {
        let local: any  = [];
        let global: any = []
        let prefixKey   = (key: string) => `${key.length === 1 ? '-' : '--'}${key}` //{optionKey}${key}{/optionKey}`
        Object.keys(options).forEach((key) => {
            let opt            = options[ key ];
            let keys: string[] = [ prefixKey(key) ]
            opt.alias          = opt.alias || [];
            let aliases: any   = kindOf(opt.alias) === 'array' ? opt.alias : [ opt.alias ]; //definition.getOptions().alias[ key ] || []
            keys               = keys.concat(aliases.map(prefixKey));
            keys.sort((a: string, b: string) => a.length - b.length);
            let type = opt.type === undefined ? '' : `[{optionType}${opt.type}{/optionType}]`;
            if ( opt.array ) {
                type = `[{optionArrayType}Array<{/optionArrayType}{optionType}${opt.type}{/optionType}{optionArrayType}>{/optionArrayType}]`
            }
            let result = {
                keys: `{optionKeys}${keys.join('{/optionKeys}{optionKeysSeperator}|{/optionKeysSeperator}{optionKeys}')}{/optionKeys}`,
                desc: `{optionDesc}${opt.desc}{/optionDesc}`,
                type
            }
            opt.global ? global.push(result) : local.push(result)
        })

        return {
            local, global,
            getLocal : () => this.columns(local),
            getGlobal: () => this.columns(global),
            toString : () => `{bold}Options:{/bold}
${this.columns(local)}

{bold}Global options:{/bold}
${this.columns(global)}`
        }
    }

    arguments(args: i.Arguments) {
        args.getKeys().forEach(name => {
            args.config(name);
        })
    }

    command(command: ParsedNode<i.CommandNodeConfig>) {
        let options = this.options(command.config.options);
        return {
            options,
            dump: () => {
                this.out.line(`{bold}${command.config.name}{/bold}
${command.config.desc}

${options}`)
            }
        };
    }

    group(group: ParsedNode<i.GroupNodeConfig>) {
        let options = this.options(group.config.options);
        return {
            options,
            dump: () => {
                this.out.line(`{bold}${group.config.name}{/bold}
${group.config.desc}

${options}`)
            }
        };
    }


    onParse(event: CliParseEvent) {
        let c = this.out.parser.colors;
        let s = merge(this.out.config.styles, this.config.styles)
        c.styles(s)

        if ( this.config.helpOption.enabled ) {
            this.addHelpOption(event.nodeConfig);
        }
    }

    onResolveRoot(rootNodeConfig: ParsedNode<i.NodeConfig>) {
        this.handleHelpOption(rootNodeConfig);
    }

    onResolveParsed(nodeConfig: ParsedNode<i.GroupNodeConfig | i.CommandNodeConfig>) {
        this.handleHelpOption(nodeConfig);
    }

    protected addHelpOption(nodeConfig: i.NodeConfig) {
        this.registry.addOption(prepareOption(
            this.config.helpOption.keys,
            nodeConfig, {
                config: { global: true, desc: 'Show this text' }
            }
        ))
    }

    protected handleHelpOption(node: ParsedNode<i.NodeConfig>) {
        if ( this.config.helpOption.enabled !== false && node.opt(this.config.helpOption.keys[ 0 ]) ) {
            if ( node.usesArguments ) {
                this.command(node).dump();
            } else {
                this.group(node).dump();
            }
        }
    }

}
