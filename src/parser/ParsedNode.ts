import { interfaces as i } from "../interfaces";
import * as _ from "lodash";
import { Container } from "../core/Container";
import { Registry } from "../core/Registry";
import { Parser } from "./Parser";
import { injectable } from "inversify";
import { kindOf } from "@radic/util";

@injectable()
export class ParsedNode<T extends i.NodeConfig> {
    public usesArguments: boolean           = false;
    public hasArguments: boolean            = false;
    public options: { [name: string]: any } = {}
    public arguments: string[]              = [];
    public str: string

    protected _options: i.Options
    protected _arguments: i.Arguments
    protected _nodeInstance: any;

    getNodeInstance(): i.Node<T> {
        if ( ! this._nodeInstance ) {
            this._nodeInstance = this.make()
        }
        return this._nodeInstance;
    }

    protected make(): i.Node<T> {
        const c             = this.config;
        const registry      = Container.getInstance().make<Registry>('console.registry')
        const parser        = Container.getInstance().make<Parser>('console.parser')
        let isRoot          = registry.root.cls === c.cls;
        let node: i.Node<T> = Container.getInstance().build<i.Node<T>>(c.cls);

        let setters = {
        }

        const addSetter = (key: string, val: any) => { if ( setters[ key ] === undefined ) setters[ key ] = val; }

        if ( c.type === 'group' ) {
            // parsed = parser.parseGroup(this.argv, c);
        } else if ( c.type === 'command' ) {
            setters[ 'arguments' ] = this._arguments
            if ( this.hasArguments ) {
                this.getArguments().getKeys().forEach(key => {
                    // @todo: if command[key] is not undefined, let it behave like a defaultOverride / fallback: command[ key ] = parsed.arg(key, command[ key ])
                    addSetter(key, this.arg(key));
                })
            }
        }

        this.getOptions().getKeys().forEach(key => addSetter(key, this.opt(key)))

        if ( ! isRoot ) {
            let rootOptionsConfig: any = registry.root.instance.getOptions().getConfig();
            Object.keys(rootOptionsConfig).forEach(key => {
                let config: i.OptionConfig = rootOptionsConfig[ key ];
                if ( ! config.global ) return;
                let opt = registry.root.instance.opt(key);
                addSetter(key, opt)
                if ( kindOf(config.alias) === 'array' ) (<string[]> config.alias).forEach(alias => addSetter(alias, opt));
                else if ( kindOf(config.alias) === 'string' ) addSetter(<string> config.alias, opt);
            })
        }

        Object.keys(setters).forEach(key => {
            node[ key ] = setters[ key ]
        })

        node['parsed'] = this;

        return node;
    }

    constructor(public argv: string[],
                protected yargsOutput: i.ParserOutput,
                public config: T,
                options: i.Options,
                args?: i.Arguments) {

        this.str = argv.join(' ');

        this._options = options;
        this.options  = _.cloneDeep(yargsOutput.argv);
        delete this.options._

        if ( args ) {
            this.arguments     = yargsOutput.argv._;
            this.usesArguments = true;
            this._arguments    = args;
            this.hasArguments  = Object.keys(args).length > 0
        }
    }

    hasOpt(name: string): boolean {
        return this._options.has(name);
    }

    /** Alias for getOption **/
    opt<O extends any>(name: string, defaultValueOverride: any = null): O {
        return this._options.get<O>(name, defaultValueOverride);
    }

    hasArg(name: string): boolean {
        if ( ! this.usesArguments ) return false;
        return false;
    }

    /** Alias for getArgument **/
    arg<A extends any>(name: string, defaultValueOverride: any = null): A {
        if ( ! this.usesArguments ) return undefined;
        return this._arguments.get<A>(name, defaultValueOverride);
    }
    //
    // /** Checks if argument or option exists name **/
    // has(name: string): boolean {
    //     return this.hasArg(name) || this.hasOpt(name)
    // }
    //
    // /** Get argument or option named name. When similar named argument and option, argument will be prioritized.  **/
    // get<G extends any>(name: string, defaultValueOverride?: any): G {
    //     if ( this.hasArg(name) ) {
    //         return this.arg<G>(name, defaultValueOverride);
    //     } else if ( this.hasOpt(name) ) {
    //         return this.opt<G>(name, defaultValueOverride);
    //     }
    //     return this._options.get<G>(name, defaultValueOverride);
    // }

    getOptions(): i.Options {
        return this._options;
    }

    getArguments(): i.Arguments {
        if ( ! this.usesArguments ) return undefined;
        return this._arguments;
    }

    getConfig(): T {
        return this.config;
    }

}
