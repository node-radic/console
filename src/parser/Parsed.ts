import { interfaces } from "../interfaces";
import  ParsedOptions  from "./ParsedOptions";
import  ParsedArguments  from "./ParsedArguments";
export default class Parsed {
    public usesArguments: boolean = false;
    public hasArguments: boolean  = false;
    public options: string[] = [];
    public arguments: string[] = [];

    protected yargsOutput: interfaces.YargsOutput
    protected _options: interfaces.Options | ParsedOptions
    protected _arguments: interfaces.Arguments | ParsedArguments



    constructor(yargsOutput: interfaces.YargsOutput, options: interfaces.Options | ParsedOptions, args?: interfaces.Arguments | ParsedArguments) {
        this.yargsOutput = yargsOutput;
        this._options    = options;

        this._arguments  = new ParsedArguments({}, {});
        if ( args ) {
            this.usesArguments = true;
            this._arguments    = args;
        }
    }

    hasOption(name: string): boolean {
        return this._options.has(name);
    }

    getOption<T extends any>(name: string, defaultValueOverride?: any): T {
        return this._options.get<T>(name, defaultValueOverride);

    }

    /** Alias for getOption **/
    option<T extends any>(name: string, defaultValueOverride?: any): T {
        return this.getOption<T>(name, defaultValueOverride);
    }


    getArgument<T extends any>(name: string, defaultValueOverride?: any): T {
        return this._arguments.get<T>(name, defaultValueOverride);
    }

    /** Alias for getArgument **/
    argument<T extends any>(name: string, defaultValueOverride?: any): T {
        return this.getArgument<T>(name, defaultValueOverride);
    }

    hasArgument(name: string): boolean {
        return false;
    }

    /** Checks if argument or option exists name **/
    has(name: string): boolean {
        return this.hasArgument(name) || this.hasOption(name)
    }

    /** Get argument or option named name. When similar named argument and option, argument will be prioritized.  **/
    get<T extends any>(name: string, defaultValueOverride?: any): T {
        if ( this.hasArgument(name) ) {
            return this.argument<T>(name);
        } else if ( this.hasOption(name) ) {
            return this.option<T>(name);
        }
        return this._options.get<T>(name, defaultValueOverride);
    }
}
