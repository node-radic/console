import { CommandConfig, OptionConfig, ArgumentConfig, Options, Arguments, GroupConfig } from "./cli-children";
export interface OptionsParserConfigConfiguration {
    'short-option-groups'?: boolean;
    'camel-case-expansion'?: boolean;
    'dot-notation'?: boolean;
    'parse-numbers'?: boolean;
    'boolean-negation'?: boolean;
    'duplicate-arguments-array'?: boolean;
    'flatten-duplicate-arrays'?: boolean;
}
export interface OptionsParserConfig extends Object {
    alias?: {
        [key: string]: string[];
    };
    array?: string[];
    boolean?: string[];
    config?: boolean;
    coerce?: {
        [key: string]: Function;
    };
    count?: string[];
    string?: string[];
    number?: string[];
    default?: {
        [key: string]: any;
    };
    narg?: {
        [key: string]: number;
    };
    envPrefix?: string;
    normalize?: boolean;
    configuration?: OptionsParserConfigConfiguration;
}
export interface ParsedArgv {
    _?: any[];
    [key: string]: any;
}
export interface Parsed {
    argv?: ParsedArgv;
    optionsConfig?: {
        [name: string]: OptionConfig;
    };
    optionsParserConfig?: OptionsParserConfig;
    options?: Options;
    argumentsConfig?: {
        [name: string]: ArgumentConfig;
    };
    arguments?: Arguments;
    error?: Error;
    aliases?: any[];
    newAliases?: any[];
    configuration?: any;
}
export declare class ParsedOptions implements Options {
    [key: string]: any;
    constructor(options: ParsedArgv);
    has(name: string): boolean;
    get<T>(name: string, defaultValueOverride?: any): T;
}
export declare class Parser {
    protected argv: string[];
    protected parsed: Parsed;
    setArgv(argv: string[]): void;
    protected transformOptionsConfig(optionsConfig: {
        [name: string]: OptionConfig;
    }): OptionsParserConfig;
    protected options(optionsConfig: {
        [name: string]: OptionConfig;
    }): Parsed;
    protected arguments(args: Parsed, argumentsConfig: {
        [name: string]: ArgumentConfig;
    }): Arguments;
    group(config: GroupConfig): Parsed;
    command(argv: string[], config: CommandConfig): Parsed;
}
export default Parser;
