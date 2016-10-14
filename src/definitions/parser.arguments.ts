import {merge, clone} from "lodash";
import {defined} from "@radic/util";
import {injectable, inject, BINDINGS} from "../core";
import {IParsedOptionsDefinition, IOptionsDefinitionParser, ParsedOptionsDefinition, OptionsDefinitionParser} from "./parser.options";
import {IArgumentsDefinition} from "./definition.arguments";


export interface IParsedArgumentsDefinition extends IParsedOptionsDefinition
{
    definition: IArgumentsDefinition
    arguments: {[name: string]: any}
    nargs: number
    hasArg(n: string): boolean
    arg(n: string): any
}

export interface IArgumentsDefinitionParser extends IOptionsDefinitionParser
{
    definition: IArgumentsDefinition
    parse(): IParsedArgumentsDefinition
}

@injectable()
export class ParsedArgumentsDefinition extends ParsedOptionsDefinition implements IParsedArgumentsDefinition
{
    definition: IArgumentsDefinition
    arguments: {[name: string]: any} = {};

    /** The number of arguments given */
    get nargs(): number {
        return Object.keys(this.arguments).length
    }

    hasArg(n: string): boolean {
        return defined(this.arguments[n]);
    }

    arg(n: string): any {
        return this.arguments[n];
    }
}

@injectable()
/**
 * Parses a Definition and Argv and produces a ParsedDefinition
 */
export class ArgumentsDefinitionParser extends OptionsDefinitionParser implements IArgumentsDefinitionParser
{
    @inject(BINDINGS.PARSED_ARGUMENTS_DEFINITION)
    public parsed: IParsedArgumentsDefinition
    public definition: IArgumentsDefinition
    protected arguments: {[name: string]: any}


    parse(): IParsedArgumentsDefinition {
        super.parse();
        // adjust the results / make our own representations of the options and arguments.
        this.parseArguments();

        this.parsed.arguments = this.arguments;

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

}
