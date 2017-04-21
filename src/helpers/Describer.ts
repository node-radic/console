import { merge } from "lodash";
import { Container, inject } from "../core/ioc";
import { interfaces as i } from "../interfaces";
import { helper } from "../decorators";
import { Output } from "./Output";
import { Registry } from "../core/Registry";
import { kindOf } from "@radic/util";

@helper('describer', {
    config   : {
        option: {
            key    : false,
            aliases: []
        },
        styles: {
            optionKeyPrefix   : 'grey',
            optionKey         : 'grey',
            optionKeySeperator: 'orange bold',
            optionDesc         : 'orange',
        }
    },
    listeners: {
        'parse': 'onParse'
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
            let type = opt.type === undefined ? '' : `[{type}${opt.type}{/type}]`;
            if ( opt.array ) {
                type = `[{type}${opt.type}[]{/type}]`
            }

            opts.push({
                keys: keys.join('{optionKeySeperator}|{/optionKeySeperator}'),
                desc: `[{optionDesc}${opt.desc}{/optionDesc}]`,
                type
            })
        })

        return opts;
    }


    protected columns(data: any, options: i.OutputColumnsOptions = {}) {
        this.out.columns(data, merge({
            columnSplitter: '   ',
            showHeaders   : false
        }, options));
    }

    protected get registry(): Registry {
        return Container.getInstance().make<Registry>('console.registry');
    }


    command(command: i.Node<i.CommandConfig> | any) {
        let options = this.options(command.options.getConfig());
        return options;
    }


    onParse() {
        let c = this.out.parser.colors;
        let s = merge(this.out.config.styles, this.config.styles)
        c.styles(s)
    }
}