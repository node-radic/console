/// <reference types="inquirer" />
/// <reference types="winston" />
import { KindOf } from "@radic/util";
import { interfaces } from "inversify";
import { Container } from "./core/Container";
import BindingInWhenOnSyntax = interfaces.BindingInWhenOnSyntax;
import { Cli } from "./core/Cli";
import { Config } from "./core/config";
import { Dispatcher } from "./core/Dispatcher";
import { Helpers } from "./core/Helpers";
import { LoggerInstance } from "winston";
import { CommandDescriber, HelpHelper } from "./helpers/helper.help";
import * as inquirer from "inquirer";
export interface CommandArguments {
    [name: string]: any;
}
export interface ParsedCommandArguments {
    /** arguments that where not found on the command. */
    missing: string[];
    valid: boolean;
    /** parsed and type-transformed argument values structure { name: value } **/
    arguments: CommandArguments;
}
export interface CommandArgumentConfig {
    /** points to the index of arguments given, used to resolve the argument value from the parsed results */
    position?: number;
    /**
     * the name of the argument.
     * usually defined in the @command name parameter.
     * will be used to map arguments to a name for the result in the CommandArguments which is passed to the command's handle() func
     */
    name?: string;
    /**
     * same as the name, defined in the @command parameter, used to map arguments
     */
    alias?: string | null;
    /** If set as required, the command will error if the argument isn't given */
    required?: boolean;
    /** only the last argument should be variadic, this makes it an array of all arguments given after the position of this argument */
    variadic?: boolean;
    /** a brief description of what this argument is about */
    description?: string;
    /**
     * used to transform the user's input (string) into the right data-type.
     * default: string
     * can be: boolean, string, numeric
     * or a custom function, which transforms the user's input string to the right data-type
     */
    type?: string;
    /**
     * if not given, use this default as value
     */
    default?: any | null;
}
export declare type CommandConfigEnabledType = boolean | ((container: Container) => boolean);
export interface CommandConfig {
    alwaysRun?: null | string;
    /** The name of the command. This will be checked and purged for argument definitions. */
    name?: string;
    /** [optional] alias that can be used instead of the name */
    alias?: string;
    /** [auto/optional] Describes the input of the command. This is auto-generated if not defined */
    usage?: string | null;
    /** Brief description of the command / group */
    description?: string;
    /** [optional] long description of the command / group */
    explanation?: string;
    /** [optional] Can be used to show some examples */
    example?: string;
    subCommands?: CommandConfig[] | Dictionary<CommandConfig>;
    /** If enabled the command will be treated as a group. The Cli will try and locate sub-commands. */
    isGroup?: boolean;
    /** Commands can be disabled by setting this on false or passing a callback that returns a boolean value */
    enabled?: CommandConfigEnabledType;
    group?: string | null;
    cls?: Function;
    filePath?: string;
    /** Defaults to 'handle' and refers to the function name in the class that should be called. It can also be a function, which can replace the need of using a class */
    action?: Function | string;
    argv?: string[];
    helpers?: {
        [name: string]: HelperOptionsConfig;
    };
    arguments?: CommandArgumentConfig[];
    options?: OptionConfig[];
    onMissingArgument?: string | 'fail' | 'handle';
}
export interface OptionConfig {
    transformer?: Function;
    /** ex(arguments: 3) result(-a argument second third -h) result(--args argument second third -h) */
    arguments?: number;
    /** ex(-vv -v) result({ v: 3 }) */
    count?: boolean;
    /** option description for help outout */
    description?: any;
    default?: any;
    /** short 1 character key -k */
    key?: string;
    /** long --name */
    name?: string;
    /**
     * Casting and handling of option
     * boolean - arguments will be casted to boolean. if no arguments, if key/name is present it will be true, otherwise false.
     * string - arguments will be casted to string
     * number - arguments will be casted to number
     *
     */
    type?: KindOf;
    /** ex(-x 1 -x 2) result({ x: [1, 2] }) */
    array?: boolean;
    cls?: Object;
}
/**  */
export interface CliConfig {
    /** arguments config **/
    parser?: {
        yargs?: ParserConfiguration;
        arguments?: {
            nullUndefined?: boolean;
            undefinedBooleanIsFalse?: boolean;
        };
    };
}
/** yargs-parser configuration */
export interface ParserConfiguration {
    'short-option-groups'?: boolean;
    'camel-case-expansion'?: boolean;
    'dot-notation'?: boolean;
    'parse-numbers'?: boolean;
    'boolean-negation'?: boolean;
    'duplicate-arguments-array'?: boolean;
    'flatten-duplicate-arrays'?: boolean;
}
export interface HelpersOptionsConfig {
    help: HelpHelperOptionsConfig;
    verbose: VerboseHelperOptionsConfig;
    input: InputHelperOptionsConfig;
    output: OutputHelperOptionsConfig;
}
export interface HelperOptionsConfig {
    [name: string]: any;
}
export interface HelperOptionsConfigOption {
    enabled?: boolean;
    key?: string;
    name?: string;
}
export interface OutputHelperOptionsConfigTableStyles {
    [name: string]: OutputHelperOptionsConfigTableStyle;
    FAT?: OutputHelperOptionsConfigTableStyle;
    SLIM?: OutputHelperOptionsConfigTableStyle;
    NONE?: OutputHelperOptionsConfigTableStyle;
}
export interface OutputHelperOptionsConfigTableStyle {
    [name: string]: string;
    'top'?: string;
    'top-mid'?: string;
    'top-left'?: string;
    'top-right'?: string;
    'bottom'?: string;
    'bottom-mid'?: string;
    'bottom-left'?: string;
    'bottom-right'?: string;
    'left'?: string;
    'left-mid'?: string;
    'mid'?: string;
    'mid-mid'?: string;
    'right'?: string;
    'right-mid'?: string;
    'middle'?: string;
}
export interface OutputHelperOptionsConfig extends HelperOptionsConfig {
    quiet?: boolean;
    colors?: boolean;
    options?: {
        quiet?: HelperOptionsConfigOption;
        colors?: HelperOptionsConfigOption;
    };
    resetOnNewline?: boolean;
    styles?: {
        [name: string]: string;
    };
    tableStyle?: OutputHelperOptionsConfigTableStyles;
}
export declare type HelpHelperOverrideType = (command: CommandConfig, describer: CommandDescriber, helper: HelpHelper) => string;
export interface HelpHelperOptionsConfig extends HelperOptionsConfig {
    app?: {
        title?: string;
    };
    addShowHelpCommand?: boolean;
    showOnError?: boolean;
    option?: {
        enabled?: boolean;
        key?: string;
        name?: string;
    };
    style?: {};
    order?: string[];
    overrides?: {
        [name: string]: HelpHelperOverrideType;
        arguments?: HelpHelperOverrideType;
        title?: HelpHelperOverrideType;
        options?: HelpHelperOverrideType;
        description?: HelpHelperOverrideType;
        explanation?: HelpHelperOverrideType;
        groups?: HelpHelperOverrideType;
        usage?: HelpHelperOverrideType;
        example?: HelpHelperOverrideType;
    };
    display?: {
        [name: string]: boolean;
        title?: boolean;
        titleLines?: boolean;
        description?: boolean;
        descriptionAsTitle?: boolean;
        usage?: boolean;
        example?: boolean;
        explanation?: boolean;
        arguments?: boolean;
        options?: boolean;
        globalOptions?: boolean;
        commands?: boolean;
        groups?: boolean;
    };
    headers?: {
        usage?: string;
        description?: string;
        explanation?: string;
        groups?: string;
        commands?: string;
        arguments?: string;
        options?: string;
        globalOptions?: string;
        example?: string;
    };
}
export interface InputHelperOptionsConfig extends HelperOptionsConfig {
    registerPrompts?: (inquirer: inquirer.Inquirer) => void;
}
export interface VerboseHelperOptionsConfig extends HelperOptionsConfig {
    option?: HelperOptionsConfigOption;
}
/**
 * Helper decorator options
 *
 * @interface
 * @see helper The helper decorator function
 */
export interface HelperOptions<T extends HelperOptionsConfig = HelperOptionsConfig> {
    singleton?: boolean;
    /** set by the decorator */
    name?: string;
    /** set by the decorator */
    cls?: any;
    /** Enables listeners, ... */
    enabled?: boolean;
    /** Bind events to methods */
    listeners?: {
        [event: string]: string;
    };
    /** the key used to inject the parsed configuration into the instance of the helper. default 'config' **/
    configKey?: string;
    /**
     * sdfsdf
     */
    config?: T;
    /** other helpers that this helper depends on */
    depends?: string[];
    /** should the helper enable it's dependencies if their not already enabled */
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
export interface PluginRegisterHelper {
    cli: Cli;
    config: Config;
    container: Container;
    events: Dispatcher;
    helpers: Helpers;
    log: LoggerInstance;
}
export interface BasePluginConfig {
    [key: string]: any;
}
export interface Plugin<T extends BasePluginConfig> {
    name: string;
    depends?: string[];
    config?: T;
    register(config: T, helper: PluginRegisterHelper): void;
}
export declare type PluginConstructor<T extends BasePluginConfig> = {
    new (): Plugin<T>;
};
export interface InlineCommand extends Object {
    [key: string]: any;
    action(args: CommandArguments): any;
    _config: CommandConfig;
    _options: OptionConfig[];
}
export interface Figures {
    tick: string;
    cross: string;
    star: string;
    square: string;
    squareSmall: string;
    squareSmallFilled: string;
    play: string;
    circle: string;
    circleFilled: string;
    circleDotted: string;
    circleDouble: string;
    circleCircle: string;
    circleCross: string;
    circlePipe: string;
    circleQuestionMark: string;
    bullet: string;
    dot: string;
    line: string;
    ellipsis: string;
    pointer: string;
    pointerSmall: string;
    info: string;
    warning: string;
    hamburger: string;
    smiley: string;
    mustache: string;
    heart: string;
    arrowUp: string;
    arrowDown: string;
    arrowLeft: string;
    arrowRight: string;
    radioOn: string;
    radioOff: string;
    checkboxOn: string;
    checkboxOff: string;
    checkboxCircleOn: string;
    checkboxCircleOff: string;
    questionMarkPrefix: string;
    oneHalf: string;
    oneThird: string;
    oneQuarter: string;
    oneFifth: string;
    oneSixth: string;
    oneSeventh: string;
    oneEighth: string;
    oneNinth: string;
    oneTenth: string;
    twoThirds: string;
    twoFifths: string;
    threeQuarters: string;
    threeFifths: string;
    threeEighths: string;
    fourFifths: string;
    fiveSixths: string;
    fiveEighths: string;
    sevenEighths: string;
}
