import { IOptionsDefinition } from "./definition.options";
import { IParsedArgv } from "./parser.argv";
export interface IParsedOptionsDefinition {
    argv: any[];
    definition: IOptionsDefinition;
    args: IParsedArgv;
    options: {
        [name: string]: any;
    };
    errors: string[];
    nopts: number;
    hasOpt(n: string): boolean;
    opt(n: string): any;
    hasErrors(): boolean;
    global?: IParsedOptionsDefinition;
}
export interface IOptionsDefinitionParser {
    definition: IOptionsDefinition;
    argv: any[];
    parse(): IParsedOptionsDefinition;
}
export declare class ParsedOptionsDefinition implements IParsedOptionsDefinition {
    options: {
        [name: string]: any;
    };
    argv: any[];
    errors: string[];
    definition: IOptionsDefinition;
    args: IParsedArgv;
    hasOpt(n: string): boolean;
    readonly nopts: number;
    opt(n: string): any;
    hasErrors(): boolean;
}
export declare class OptionsDefinitionParser implements IOptionsDefinitionParser {
    parsed: IParsedOptionsDefinition;
    definition: IOptionsDefinition;
    argv: any[];
    protected args: IParsedArgv;
    protected errors: string[];
    protected options: {
        [name: string]: any;
    };
    parse(): IParsedOptionsDefinition;
    protected parseOptions(): void;
}
