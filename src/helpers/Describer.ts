import * as _ from "lodash";
import { merge } from "lodash";
import { Container, inject } from "../core/Container";
import { interfaces as i } from "../interfaces";
import { helper } from "../decorators";
import { Output } from "./Output";
import { kindOf } from "@radic/util";
import { ParsedNode } from "../parser/ParsedNode";
import { CliParseEvent } from "../core/Cli";
import { addOption } from "../core/nodes";

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
        templates : {
            command: ``
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
    },
    bindings : {}
})
export class Describer {

    config: any;

    constructor(@inject('console.helpers.output') protected out: Output) {
    }

    protected columns(data: any, options: i.OutputColumnsOptions = {}): string {
        return this.out.columns(data, merge({
            columnSplitter: '   ',
            showHeaders   : false
        }, options), true);
    }

    options(options: { [name: string]: i.OptionConfig }): string {
        let describedOptions: any = [];
        let prefixKey             = (key: string) => `${key.length === 1 ? '-' : '--'}${key}` //{optionKey}${key}{/optionKey}`
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
            describedOptions.push(result);
        })

        return this.columns(describedOptions)
    }


    arguments(args: { [name: string]: i.ArgumentConfig }) {
        let descs: any[] = [];
        Reflect.ownKeys(args).forEach(name => {
            let arg = args[ name ];

        })
    }

    command(command: ParsedNode<i.CommandNodeConfig>) {
        let { local, global } = this.splitOptions(command.config.options)
        let args              = this.arguments(command.config.arguments);
        return `{bold}${command.config.name}{/bold}
${command.config.desc}

{bold}Options{/bold}
${this.options(local)}

{bold}Global options:{/bold}
${this.options(global)}`;
    }

    protected splitOptions(options: { [name: string]: i.OptionConfig }): { local: { [name: string]: i.OptionConfig }, global: { [name: string]: i.OptionConfig } } {
        let local: any  = _.pickBy(options, (opt) => opt.global === false);
        let global: any = _.pickBy(options, (opt) => opt.global === true);
        return { local, global }
    }

    group(group: ParsedNode<i.GroupNodeConfig>) {
        let { local, global } = this.splitOptions(group.config.options)
        return `{bold}${group.config.name}{/bold}
${group.config.desc}

{bold}Options{/bold}
${this.options(local)}

{bold}Global options:{/bold}
${this.options(global)}`;

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
        addOption(this.config.helpOption.keys, { global: true, desc: 'Show this text' }, nodeConfig)
    }


    protected handleHelpOption(node: ParsedNode<i.NodeConfig>) {
        let output = '';
        if ( this.config.helpOption.enabled !== false && node.opt(this.config.helpOption.keys[ 0 ]) ) {
            if ( node.usesArguments ) {
                output = this.command(node)
            } else {
                output = this.group(node)
            }
        }
        this.out.line(output);
    }


    goptions(options: { [name: string]: i.OptionConfig }): DescribedOptions {
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

{bold.red}Global options:{/bold.red}
${this.columns(global)}`
        }
    }


}
