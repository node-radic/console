import {merge, clone} from "lodash";
import {inject, injectable} from "inversify";
import {IDefinition, IDefinitionParser, IParsedDefinition} from "../interfaces";
import {BINDINGS} from "../types";
import {defined} from "@radic/util";
import * as yargsParser from "yargs-parser";

export interface IDefinitionParser<T>
{
    definition: T
    argv: any[]

    parse(): IParsedDefinition<T>
}

export interface IParsedDefinition<T>
{
    argv: any[]
    definition: T
    args: YargsParserDetailed

    options: {[name: string]: any}
    arguments: {[name: string]: any}
    errors: string[]

    nargs: number
    nopts: number

    hasArg(n: string): boolean
    arg(n: string): any
    hasOpt(n: string): boolean
    opt(n: string): any

    hasErrors(): boolean
}


@injectable()
export class ParsedDefinition implements IParsedDefinition
{
    options: {[name: string]: any}   = {};
    arguments: {[name: string]: any} = {};
    argv: any[]
    errors: string[]                 = [];

    definition: IDefinition
    args: YargsParserDetailed

    /** The number of options given */
    get nopts() {
        return this.argv.length - this.nargs;
    }

    /** The number of arguments given */
    get nargs() {
        return Object.keys(this.arguments).length
    }

    hasArg(n: string): boolean {
        return defined(this.arguments[n]);
    }

    arg(n: string): any {
        return this.arguments[n];
    }

    hasOpt(n: string): boolean {
        return defined(this.arguments[n]);
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
 */
export class DefinitionParser implements IDefinitionParser
{
    @inject(BINDINGS.PARSED_DEFINITION)
    public parsed: IParsedDefinition
    public definition: IDefinition
    public argv: any[]
    //public _: string[]

    protected args: YargsParserDetailed
    protected errors: string[] = [];
    protected arguments: {[name: string]: any}
    protected options: {[name: string]: any}


    parse(): IParsedDefinition {
        // first let yargs-parser make sense of it
        this.args = yargsParser.detailed(this.argv, this.definition.getOptions());

        // adjust the results / make our own representations of the options and arguments.
        this.parseOptions();
        this.parseArguments();

        // and build the parsed defintion from that
        this.parsed.argv       = this.argv;
        this.parsed.args       = this.args;
        this.parsed.errors     = this.errors;
        this.parsed.definition = this.definition;
        this.parsed.arguments  = this.arguments;
        this.parsed.options    = this.options;

        // and return it :)
        return this.parsed;
    }

    protected parseArguments() {
        let all    = this.definition.getArguments();
        // let names = Object.keys(all);
        let input  = {};
        let args   = clone(this.args.argv._);
        let errors = [];

        // Associate arguments with values
        Object.keys(all).forEach((name: string, i: number) => {
            if (i > args.length - 1) {
                if (all[name].required) return this.errors.push(`The argument [${name}] is required`)
                input[name] = all[name].default;
            } else {
                input[name] = args[i]
            }
        })

        this.arguments = input;
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
