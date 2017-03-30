import { merge, cloneDeep } from 'lodash'
import { bindTo, inject } from "../core/ioc";
import { interfaces as i } from '../interfaces'
import Output from "./Output";
@bindTo('console.helpers.describer')
export default class Describer {

    constructor(@inject('console.helpers.output') protected out: Output) {}

    arguments(args: i.Arguments) {
        args.getKeys().forEach(name => {
            args.getConfig(name);
        })
    }


    options(options:{ [name: string]: i.OptionConfig }) {
        let opts: any = [];
        let prefixKey = (key: string) => (key.length === 1 ? '-' : '--') + key
        Object.keys(options).forEach((key) => {
            let opt            = options[ key ];
            let keys: string[] = [ prefixKey(key) ]
            let aliases        = []; //definition.getOptions().alias[ key ] || []
            keys               = keys.concat(aliases.map(prefixKey));
            keys.sort((a: string, b: string) => a.length - b.length);
            let type = `[{yellow}${opt.type}{/yellow}]`
            type     = opt.type === undefined ? '' : type;
            opts.push([ keys.join('{grey}|{/grey}'), opt.desc, type ])
        })

        this.columns(opts.map((opt) => {
            return { keys: opt[ 0 ], desc: opt[ 1 ], type: opt[ 2 ] }
        }))
    }


    protected columns(data: any, options: i.OutputColumnsOptions = {}) {
        this.out.columns(data, merge({
            columnSplitter: '   ',
            showHeaders   : false
        }, options));
    }

}