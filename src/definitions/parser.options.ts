
import {merge, clone} from "lodash";
import {inject, injectable, BINDINGS} from "../core";
import {defined} from "@radic/util";
import {IOptionsDefinition} from "./definition.options";
import {IParsedArgv, parseArgv} from "./parser.argv";
import {app} from "../core/app";


export interface IParsedOptionsDefinition
{
    argv: any[]
    definition: IOptionsDefinition
    args: IParsedArgv

    options: {[name: string]: any}
    errors: string[]

    nopts: number

    hasOpt(n: string): boolean
    opt(n: string): any

    hasErrors(): boolean

    global?: IParsedOptionsDefinition
}
export interface IOptionsDefinitionParser
{
    definition: IOptionsDefinition
    argv: any[]

    parse(): IParsedOptionsDefinition
}

@injectable()
export class ParsedOptionsDefinition implements IParsedOptionsDefinition
{
    options: {[name: string]: any}   = {};
    argv: any[]
    errors: string[]                 = [];

    definition: IOptionsDefinition
    args: IParsedArgv

    hasOpt(n: string): boolean {
        return typeof this.options[n] !== "undefined"
    }
    /** The number of options given */
    get nopts() :number {
        return Object.keys(this.options).length
    }

    opt(n: string): any {
        if (false === this.hasOpt(n)) return false;
        return this.options[n];
    }

    hasErrors(): boolean {
        return this.errors.length > 0;
    }
}

@injectable()
/**
 * Parses a Definition and Argv and produces a ParsedDefinition
 * @
 */
export class OptionsDefinitionParser implements IOptionsDefinitionParser
{
    @inject(BINDINGS.PARSED_OPTIONS_DEFINITION)
    public parsed: IParsedOptionsDefinition
    public definition: IOptionsDefinition
    public argv: any[]
    //public _: string[]

    protected args: IParsedArgv
    protected errors: string[] = [];
    protected options: {[name: string]: any}



    parse(): IParsedOptionsDefinition {
        // first let yargs-parser make sense of it
        this.args = parseArgv(this.argv, this.definition.getOptions());

        // adjust the results / make our own representations of the options and arguments.
        this.parseOptions();

        // and build the parsed defintion from that
        this.parsed.argv       = this.argv;
        this.parsed.args       = this.args;
        this.parsed.errors     = this.errors;
        this.parsed.definition = this.definition;
        this.parsed.options    = this.options;

        // and return it :)
        return this.parsed;
    }

    protected parseOptions() {
        // re-apply "nested" options defaults
        this.definition.getOptions().nested.forEach((key: string) => {
            let defaults        = this.definition.getOptions().default[key];
            let aliases         = this.args.aliases[key];
            this.args.argv[key] = merge({}, defaults, this.args.argv[key]);
            aliases.forEach((alias) => this.args.argv[alias] = merge({}, defaults, this.args.argv[alias]))
        })

        // clone the argv and remove the arguments from it, resulting in all the options
        let options = clone(this.args.argv);
        delete options._
        this.options = options;
    }

}



