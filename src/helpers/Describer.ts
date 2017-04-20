import { merge } from "lodash";
import { Container, inject } from "../core/ioc";
import { interfaces as i } from "../interfaces";
import { helper } from "../decorators";
import { Output } from "./Output";
import { Registry } from "../core/Registry";
import { ResolverResult } from "../core/ResolverResult";

@helper('describer', {
    config   : {
        option: {
            key    : false,
            aliases: []
        }
    },
    listeners: {
    //    'route:execute': 'onNodeResolverResultExecute'
    }
})
export class Describer {
    config: any;

    constructor(@inject('console.helpers.output') protected out: Output) {}

    arguments(args: i.Arguments) {
        args.getKeys().forEach(name => {
            args.config(name);
        })
    }


    options(options: { [name: string]: i.OptionConfig }): Array<{ keys: string[], desc: string, type: string }> {
        let opts: any = [];
        let prefixKey = (key: string) => (key.length === 1 ? '-' : '--') + key
        Object.keys(options).forEach((key) => {
            let opt            = options[ key ];
            let keys: string[] = [ prefixKey(key) ]
            let aliases        = []; //definition.getOptions().alias[ key ] || []
            keys               = keys.concat(aliases.map(prefixKey));
            keys.sort((a: string, b: string) => a.length - b.length);

            opts.push({
                keys: keys.join('{grey}|{/grey}'),
                desc: `[{desc}${opt.desc}{/desc}]`,
                type: opt.type === undefined ? '' : `[{type}${opt.type}{/type}]`
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


    onNodeResolverResultExecute(route: ResolverResult<i.NodeConfig, i.Node<i.NodeConfig>>) {
        if ( ! this.config.option.key ) return;
        if ( route.item.cls === this.registry.root.cls ) {
            console.log('ROOT');
        }
        return 555
    }
}