import { KindOf } from "@radic/util";
import { interfaces } from "inversify";
import { Container } from "./core/Container";
import BindingInWhenOnSyntax = interfaces.BindingInWhenOnSyntax;
export interface CommandArguments {
    [name: string]: any;
}
export interface ParsedCommandArguments {
    missing: string[];
    valid: boolean;
    arguments: CommandArguments;
}
export interface CommandArgumentConfig {
    position?: number;
    name?: string;
    alias?: string | null;
    required?: boolean;
    variadic?: boolean;
    description?: string;
    type?: string;
    default?: any | null;
}
export declare type CommandConfigEnabledType = boolean | ((container: Container) => boolean);
export interface CommandConfig {
    alwaysRun?: boolean;
    name?: string;
    alias?: string;
    usage?: string | null;
    description?: string;
    example?: string;
    explenation?: string;
    subCommands?: CommandConfig[] | Dictionary<CommandConfig>;
    isGroup?: boolean;
    enabled?: CommandConfigEnabledType;
    group?: string | null;
    cls?: Function;
    filePath?: string;
    action?: Function | string;
    args?: string[];
    helpers?: {
        [name: string]: HelperOptionsConfig;
    };
    arguments?: CommandArgumentConfig[];
    onMissingArgument?: string | 'fail' | 'handle';
}
export interface OptionConfig {
    transformer?: Function;
    arguments?: number;
    count?: boolean;
    description?: any;
    default?: any;
    key?: string;
    name?: string;
    type?: KindOf;
    array?: boolean;
    cls?: Object;
}
export interface CliConfig {
    parser?: {
        yargs?: ParserConfiguration;
        arguments?: {
            nullUndefined?: boolean;
            undefinedBooleanIsFalse?: boolean;
        };
    };
}
export interface ParserConfiguration {
    'short-option-groups'?: boolean;
    'camel-case-expansion'?: boolean;
    'dot-notation'?: boolean;
    'parse-numbers'?: boolean;
    'boolean-negation'?: boolean;
    'duplicate-arguments-array'?: boolean;
    'flatten-duplicate-arrays'?: boolean;
}
export interface HelperOptionsConfig {
    [name: string]: any;
}
export interface HelperOptions {
    singleton?: boolean;
    name?: string;
    cls?: any;
    enabled?: boolean;
    listeners?: {
        [event: string]: string;
    };
    configKey?: string;
    config?: HelperOptionsConfig;
    depends?: string[];
    enableDepends?: boolean;
    binding?: BindingInWhenOnSyntax<any>;
    bindings?: {
        [key: string]: string;
    };
}
export interface OutputColumnsOptions {
    columns?: string[];
    minWidth?: number;
    maxWidth?: number;
    align?: 'left' | 'right' | 'center';
    paddingChr?: string;
    columnSplitter?: string;
    preserveNewLines?: boolean;
    showHeaders?: boolean;
    dataTransform?: (data) => string;
    truncate?: boolean;
    truncateMarker?: string;
    widths?: {
        [name: string]: OutputColumnsOptions;
    };
    config?: {
        [name: string]: OutputColumnsOptions;
    };
}
export interface Dictionary<T> {
    [index: string]: T;
}
export interface NumericDictionary<T> {
    [index: number]: T;
}
export interface StringRepresentable {
    toString(): string;
}
