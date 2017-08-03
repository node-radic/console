import { KindOf } from "@radic/util";
import { interfaces } from "inversify";
import {  Container } from "./core/Container";
import BindingInWhenOnSyntax = interfaces.BindingInWhenOnSyntax;
import { Cli } from "./core/Cli";
import { Config } from "./core/config";
import { Dispatcher } from "./core/Dispatcher";
import { Helpers } from "./core/Helpers";
import { LoggerInstance } from "winston";


export interface CommandArguments {
    [name: string]: any
}

export interface ParsedCommandArguments {
    /** arguments that where not found on the command. */
    missing: string[]
    valid: boolean
    /** parsed and type-transformed argument values structure { name: value } **/
    arguments: CommandArguments
}

export interface CommandArgumentConfig {
    /** points to the index of arguments given, used to resolve the argument value from the parsed results */
    position?: number

    /**
     * the name of the argument.
     * usually defined in the @command name parameter.
     * will be used to map arguments to a name for the result in the CommandArguments which is passed to the command's handle() func
     */
    name?: string

    /**
     * same as the name, defined in the @command parameter, used to map arguments
     */
    alias?: string | null

    /** If set as required, the command will error if the argument isn't given */
    required?: boolean

    /** only the last argument should be variadic, this makes it an array of all arguments given after the position of this argument */
    variadic?: boolean

    /** a brief description of what this argument is about */
    description?: string

    /**
     * used to transform the user's input (string) into the right data-type.
     * default: string
     * can be: boolean, string, numeric
     * or a custom function, which transforms the user's input string to the right data-type
     */
    type?: string

    /**
     * if not given, use this default as value
     */
    default?:any | null
}
export type CommandConfigEnabledType = boolean | ((container: Container) => boolean)
export interface CommandConfig {
    alwaysRun?: null | string

    /** The name of the command. This will be checked and purged for argument definitions. */

    name?: string
    alias?: string
    usage?: string | null
    description?: string
    example?: string
    explenation?: string
    subCommands?: CommandConfig[] | Dictionary<CommandConfig>
    isGroup?: boolean
    enabled?: CommandConfigEnabledType
    group?: string | null
    cls?: Function
    filePath?: string
    action?: Function | string
    argv?: string[]
    helpers?: { [name: string]: HelperOptionsConfig }
    arguments?: CommandArgumentConfig[]
    onMissingArgument?: string | 'fail' | 'handle'
}

export interface OptionConfig {

    transformer?: Function;
    /** ex(arguments: 3) result(-a argument second third -h) result(--args argument second third -h) */
    arguments?: number;
    /** ex(-vv -v) result({ v: 3 }) */
    count?: boolean;
    /** option description for help outout */
    description?: any;
    default?: any
    /** short 1 character key -k */
    key?: string
    /** long --name */
    name?: string
    /**
     * Casting and handling of option
     * boolean - arguments will be casted to boolean. if no arguments, if key/name is present it will be true, otherwise false.
     * string - arguments will be casted to string
     * number - arguments will be casted to number
     *
     */
    type?: KindOf
    /** ex(-x 1 -x 2) result({ x: [1, 2] }) */
    array?: boolean

    cls?: Object
}


/**  */
export interface CliConfig {
    /** arguments config **/
    parser?: {
        yargs?: ParserConfiguration,
        arguments?: {
            nullUndefined?: boolean
            undefinedBooleanIsFalse?: boolean
        }
    }
}

/** yargs-parser configuration */
export interface ParserConfiguration {
    'short-option-groups'?: boolean
    'camel-case-expansion'?: boolean
    'dot-notation'?: boolean
    'parse-numbers'?: boolean
    'boolean-negation'?: boolean
    'duplicate-arguments-array'?: boolean
    'flatten-duplicate-arrays'?: boolean
}


export interface HelperOptionsConfig {
    [name: string]: any

}

/**
 * Helper decorator options
 *
 * @interface
 * @see helper The helper decorator function
 */
export interface HelperOptions {
    singleton?: boolean
    /** set by the decorator */
    name?: string
    /** set by the decorator */
    cls?: any

    /** Enables listeners, ... */
    enabled?: boolean
    /** Bind events to methods */
    listeners?: { [event: string]: string }
    /** the key used to inject the parsed configuration into the instance of the helper. default 'config' **/
    configKey?: string
    /**
     * sdfsdf
     */
    config?: HelperOptionsConfig,
    /** other helpers that this helper depends on */
    depends?: string[]
    /** should the helper enable it's dependencies if their not already enabled */
    enableDepends?: boolean
    binding?: BindingInWhenOnSyntax<any>;

    bindings?: { [key: string]: string }
}


export interface OutputColumnsOptions {
    columns?: string[]
    minWidth?: number
    maxWidth?: number
    align?: 'left' | 'right' | 'center'
    paddingChr?: string
    columnSplitter?: string
    preserveNewLines?: boolean
    showHeaders?: boolean
    dataTransform?: (data) => string
    truncate?: boolean
    truncateMarker?: string
    widths?: { [name: string]: OutputColumnsOptions }
    config?: { [name: string]: OutputColumnsOptions }
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


export interface PluginRegisterHelper {
    cli: Cli
    config: Config
    container: Container
    events: Dispatcher
    helpers: Helpers
    log: LoggerInstance
}
export interface BasePluginConfig {
    [key:string]: any
}
export interface Plugin<T extends BasePluginConfig> {
    name:string
    depends?: string[]
    config?:T
    register(config:T, helper:PluginRegisterHelper) : void
}