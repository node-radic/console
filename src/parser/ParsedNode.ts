import { interfaces as i } from "../interfaces";
import * as _ from "lodash";
import {ArgumentCollection } from "./InputCollections";
import { Container } from "../core/ioc";
import { Registry } from "../core/Registry";
import { Parser } from "./Parser";
import { injectable } from "inversify";
import { kindOf } from "@radic/util";

@injectable()
export class ParsedNode {
    public usesArguments: boolean           = false;
    public hasArguments: boolean            = false;
    public options: { [name: string]: any } = {}
    public arguments: string[]              = [];
    public str: string


    protected _nodeInstance: any;

    getNodeInstance<T>(): T {
        if ( ! this._nodeInstance ) {
            this._nodeInstance = this.make<T>()
        }
        return this._nodeInstance;
    }

    make<T>(): T {
        const c        = this.config;
        const registry = Container.getInstance().make<Registry>('console.registry')
        const parser   = Container.getInstance().make<Parser>('console.parser')
        let isRoot     = registry.root.cls === c.cls;
        let node: T    = Container.getInstance().build<T>(c.cls);

        let setters = {
            _config: c,
            options: this._options
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
                let config: i.RootOptionConfig = rootOptionsConfig[ key ];
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

        return node;
    }


    _options: i.Options
    _arguments: i.Arguments


    constructor(public argv: string[],
                protected yargsOutput: i.YargsOutput,
                protected config: i.NodeConfig | i.GroupConfig | i.CommandConfig,
                options: i.Options,
                args?: i.Arguments) {

        this.str = argv.join(' ');

        this._options = options;
        this.options  = _.cloneDeep(yargsOutput.argv);
        delete this.options._

        this.arguments = yargsOutput.argv._;

        this._arguments = new ArgumentCollection({}, {});
        if ( args ) {
            this.usesArguments = true;
            this._arguments    = args;
            this.hasArguments  = Object.keys(args).length > 0
        }
    }

    hasOpt(name: string): boolean {
        return this._options.has(name);
    }

    /** Alias for getOption **/
    opt<T extends any>(name: string, defaultValueOverride: any = null): T {
        return this._options.get<T>(name, defaultValueOverride);
    }

    /** Alias for getArgument **/
    arg<T extends any>(name: string, defaultValueOverride: any = null): T {
        return this._arguments.get<T>(name, defaultValueOverride);
    }

    hasArg(name: string): boolean {
        return false;
    }

    /** Checks if argument or option exists name **/
    has(name: string): boolean {
        return this.hasArg(name) || this.hasOpt(name)
    }

    /** Get argument or option named name. When similar named argument and option, argument will be prioritized.  **/
    get<T extends any>(name: string, defaultValueOverride?: any): T {
        if ( this.hasArg(name) ) {
            return this.arg<T>(name);
        } else if ( this.hasOpt(name) ) {
            return this.opt<T>(name);
        }
        return this._options.get<T>(name, defaultValueOverride);
    }

    getOptions(): i.Options {
        return this._options;
    }

    getArguments(): i.Arguments {
        return this._arguments;
    }

    getConfig(): i.NodeConfig {
        return this.config;
    }

}