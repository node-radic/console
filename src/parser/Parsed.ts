import { interfaces } from "../interfaces";
import * as _ from 'lodash'
import  ParsedArguments  from "./ParsedArguments";

export default class Parsed {
    public usesArguments: boolean           = false;
    public hasArguments: boolean            = false;
    public options: { [name: string]: any } = {}
    public arguments: string[]              = [];
    public str: string

    protected _options: interfaces.Options
    protected _arguments: interfaces.Arguments


    constructor(public original: string[],
                protected yargsOutput: interfaces.YargsOutput,
                options: interfaces.Options,
                args?: interfaces.Arguments) {

        this.str = original.join(' ');

        this._options = options;
        this.options  = _.cloneDeep(yargsOutput.argv);
        delete this.options._

        this.arguments  = yargsOutput.argv._;
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
    opt<T extends any>(name: string, defaultValueOverride?: any): T {
        return this._options.get<T>(name, defaultValueOverride);
    }

    /** Alias for getArgument **/
    arg<T extends any>(name: string, defaultValueOverride?: any): T {
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

    getOptions(): interfaces.Options {
        return this._options;
    }

    getArguments(): interfaces.Arguments {
        return this._arguments;
    }
}
