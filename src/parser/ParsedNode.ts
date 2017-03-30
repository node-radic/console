import { interfaces as i } from "../interfaces";
import * as _ from 'lodash'
import  ParsedArguments  from "./Arguments";
import { Container } from "../core/ioc";
import { inject } from "../index";
import { Registry } from "../core/registry";
import Parser from "./Parser";
import { injectable } from "inversify";

@injectable()
export default class ParsedNode {
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
        const registry      = Container.getInstance().make<Registry>('console.registry')
        const parser        = Container.getInstance().make<Parser>('console.parser')
        let node: T         = Container.getInstance().build<T>(c.cls);


        let setters = {
            _config: c,
            options: this._options
        }
        let parsed: ParsedNode;

        if ( c.type === 'group' ) {
            // parsed = parser.parseGroup(this.argv, c);
        } else if ( c.type === 'command' ) {

            setters[ 'arguments' ] = this._arguments
            if ( this.hasArguments ) {
                this.getArguments().getKeys().forEach(key => {
                    // @todo: if command[key] is not undefined, let it behave like a defaultOverride / fallback: command[ key ] = parsed.arg(key, command[ key ])
                    if ( setters[ key ] === undefined ) {
                        setters[ key ] = this.arg(key)
                    }
                })
            }
        }

        this.getOptions().getKeys().forEach(key => {
            if ( setters[ key ] === undefined ) {
                setters[ key ] = this.opt(key)
            }
        })

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

        this.arguments  = yargsOutput.argv._;
        this.hasArguments = Object.keys(this.arguments).length > 0
        this._arguments = new ParsedArguments({}, {});
        if ( args ) {
            this.usesArguments = true;
            this._arguments    = args;
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


}
