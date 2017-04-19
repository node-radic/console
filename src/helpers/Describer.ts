import { find, merge } from "lodash";
import { Container, inject } from "../core/ioc";
import { interfaces as i } from "../interfaces";
import Output from "./Output";
import { helper } from "../decorators";
import { kindOf } from "@radic/util";
import Registry from "../core/Registry";
import Route from "../core/Route";

@helper('describer', {
    config: {},
    listeners: {
        'route:execute': 'onRouteExecute'
    }
})
export default class Describer {

    constructor(@inject('console.helpers.output') protected out: Output) {}

    arguments(args: i.Arguments) {
        args.getKeys().forEach(name => {
            args.config(name);
        })
    }


    options(options: { [name: string]: i.OptionConfig }) : Array<{keys:string[], desc:string, type:string}> {
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
            opts.push({keys:  keys.join('{grey}|{/grey}'), desc: opt.desc, type })
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


    command(command: i.Node<i.CommandConfig>|any){
        let options = this.options(command.options.getConfig());
        return options;
    }


    onRouteExecute(route:Route<any, any>){
        console.log('route in describer', route);
        
        return 555
    }
}