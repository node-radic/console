import { IParsedOptionsDefinition, IOptionsDefinitionParser, ParsedOptionsDefinition, OptionsDefinitionParser } from "./parser.options";
import { IArgumentsDefinition } from "./definition.arguments";
export interface IParsedArgumentsDefinition extends IParsedOptionsDefinition {
    definition: IArgumentsDefinition;
    arguments: {
        [name: string]: any;
    };
    nargs: number;
    hasArg(n: string): boolean;
    arg(n: string): any;
}
export interface IArgumentsDefinitionParser extends IOptionsDefinitionParser {
    definition: IArgumentsDefinition;
    parse(): IParsedArgumentsDefinition;
}
export declare class ParsedArgumentsDefinition extends ParsedOptionsDefinition implements IParsedArgumentsDefinition {
    definition: IArgumentsDefinition;
    arguments: {
        [name: string]: any;
    };
    readonly nargs: number;
    hasArg(n: string): boolean;
    arg(n: string): any;
}
export declare class ArgumentsDefinitionParser extends OptionsDefinitionParser implements IArgumentsDefinitionParser {
    parsed: IParsedArgumentsDefinition;
    definition: IArgumentsDefinition;
    protected arguments: {
        [name: string]: any;
    };
    parse(): IParsedArgumentsDefinition;
    protected parseArguments(): void;
}
