import { merge } from "lodash";
import { Container, inject } from "../core/Container";
import { interfaces as i } from "../interfaces";
import { helper } from "../decorators";
import { Output } from "./Output";
import { Registry } from "../core/Registry";
import { kindOf } from "@radic/util";
import { ParsedNode } from "../parser/ParsedNode";

@helper('describer', {
    config   : {
        help  : false,
        //help: ['h', 'help']
        styles: {
            optionKeys         : '#999',
            optionKeysSeperator: '#ff6a4d',
            optionDesc         : 'orange',
            optionType         : 'yellow',
            optionArrayType    : 'cyan bold'
        }
    },
    listeners: {
        'parse'         : 'onParse',
        'parsed'        : 'onParsed',
        'resolve:root'  : 'onResolveRoot',
        'resolve:parsed': 'onResolveParsed'
    }
})
export class Describer {
    config: any;

    constructor(@inject('console.helpers.output') protected out: Output) {

    }

    arguments(args: i.Arguments) {
        args.getKeys().forEach(name => {
            args.config(name);
        })
    }

    options(options: { [name: string]: i.OptionConfig }): Array<{ keys: string[], desc: string, type: string }> {
        let opts: any = [];
        let prefixKey = (key: string) => `${key.length === 1 ? '-' : '--'}${key}` //{optionKey}${key}{/optionKey}`
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

            opts.push({
                keys: `{optionKeys}${keys.join('{/optionKeys}{optionKeysSeperator}|{/optionKeysSeperator}{optionKeys}')}{/optionKeys}`,
                desc: `{optionDesc}${opt.desc}{/optionDesc}`,
                type
            })
        })

        return opts;
    }


    protected columns(data: any, options: i.OutputColumnsOptions = {}): string {
        return this.out.columns(data, merge({
            columnSplitter: '   ',
            showHeaders   : false
        }, options), true);
    }

    protected get registry(): Registry {
        return Container.getInstance().make<Registry>('console.registry');
    }


    command(command: ParsedNode<i.CommandNodeConfig>) {
        let options = this.options(command.config.options);
        return { options };
    }

    group(group: ParsedNode<i.GroupNodeConfig>) {
        let options = this.options(group.config.options);
        return {
            options,
            dump: () => {
                this.out.line(`
{bold}${group.config.name}{/bold}
${group.config.desc}

{bold}Options{/bold}
${this.columns(options)}
                `)


            }
        };
    }


    onParse(argv:string[], config:i.NodeConfig) {
        let c = this.out.parser.colors;
        let s = merge(this.out.config.styles, this.config.styles)
        c.styles(s)
    }

    protected addHelpToNode(node: ParsedNode<i.GroupNodeConfig | i.CommandNodeConfig>) {
        if ( this.config.help === false ) return;
        let alias:string[] = kindOf(this.config.help) === 'string' ? [ this.config.help ] : this.config.help;
        let name:string = alias.sort((a,b) => a.length-b.length).shift()
        node.config.options[name] = { name, desc: 'Show this text' };

    }

    onParsed(rootNode: ParsedNode<i.GroupNodeConfig>) {
        if ( this.config.help !== false ) {
            rootNode.config.options
        }
    }

    onResolveRoot(rootNode: ParsedNode<i.GroupNodeConfig>) {
        if ( this.config.help !== false && rootNode.opt(this.config.help[ 0 ]) ) {
            this.group(rootNode).dump();
        }
    }

    onResolveParsed(node: ParsedNode<i.GroupNodeConfig | i.CommandNodeConfig>) {
        if ( this.config.help !== false && node.opt(this.config.help[ 0 ]) ) {

        }
        node.getNodeInstance();
    }
}