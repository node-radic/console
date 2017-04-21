import { CliMode } from "./core/cli";
import { ArgumentType, Command, Group, NodeType, OptionType } from "./core/nodes";
import { ParsedNode } from "./parser/ParsedNode";
namespace interfaces {

    /**  */
    export interface CliConfig {
        /** group for a 'git' like cli. command for 1 command with */
        mode?: CliMode
        /** arguments config **/
        parser?: {
            yargs?: YargsConfiguration,
            arguments?: {
                nullUndefined?: boolean
                undefinedBooleanIsFalse?: boolean
            }
        }
    }

    /** yargs-parser configuration */
    export interface YargsConfiguration {
        'short-option-groups'?: boolean
        'camel-case-expansion'?: boolean
        'dot-notation'?: boolean
        'parse-numbers'?: boolean
        'boolean-negation'?: boolean
        'duplicate-arguments-array'?: boolean
        'flatten-duplicate-arrays'?: boolean
    }

    /** yargs-parser configuration */
    export interface YargsOptionsConfig extends Object {
        alias?: { [key: string]: string[] }
        array?: string[]
        boolean?: string[]
        config?: boolean
        coerce?: { [key: string]: Function }
        count?: { [key: string]: number }
        string?: string[]
        number?: string[]
        default?: { [key: string]: any }
        narg?: { [key: string]: number }

        envPrefix?: string
        normalize?: boolean
        configuration?: YargsConfiguration
    }

    /** yargs-parser detailed output arv */
    export interface YargsOutputArgv {
        _?: any[],
        [key: string]: any
    }

    /** yargs-parser parsed argv detailed output */
    export interface YargsOutput {
        argv?: YargsOutputArgv
        error?: Error
        aliases?: any[]
        newAliases?: any[]
        configuration?: any
    }

    /** Output from Parser */
    export interface ParserOutput {
        argv?: YargsOutputArgv
        optionsConfig?: { [name: string]: OptionConfig }
        optionsParserConfig?: YargsOptionsConfig
        options?: Options
        argumentsConfig?: { [name: string]: ArgumentConfig }
        arguments?: Arguments
        error?: Error
        aliases?: any[]
        newAliases?: any[]
        configuration?: any
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
        /** set by the decorator */
        name?: string
        /** set by the decorator */
        cls?: any
        /** flag binding in container as singleton */
        singleton?: boolean
        /** Enables listeners, ... */
        enabled?: boolean
        /** Bind events to methods */
        listeners?: { [event: string]: string }
        /** the key used to inject the parsed configuration into the instance of the helper. default 'config' **/
        configKey?: string

        /**
         * sdfsdf
         */
        config?: HelperOptionsConfig
    }

    /** Declaration of a option */
    export interface OptionConfig {
        name?: string
        default?: any
        type?: OptionType

        desc?: string
        alias?: string | string[]

        array?: boolean

        transformer?: (arg: any) => any
        arguments?: number
        count?: number
    }

    /** Declaration of a option on the Cli class  */
    export interface RootOptionConfig extends OptionConfig {
        global?: boolean
    }

    /** Declaration of a argument */
    export interface ArgumentConfig {
        name?: string
        desc?: string
        required?: boolean
        type?: ArgumentType
        default?: any
    }

    export interface RootConfig {
        globalOptions: { [name: string]: OptionConfig }
        cls?: any
        instance?: ParsedNode | null
    }

    /**  */
    export interface NodeConfig { //extends Object
        name?: string
        type?: NodeType
        group?: any
        cls?: any
        options?: { [name: string]: OptionConfig }
        aliases?: string[]
        desc?: string
    }


    export interface DecoratedConfig<C extends OptionConfig | ArgumentConfig | any> {
        target: Object
        cls: Function
        key: string | symbol
        config: C
        type: any

    }

    export interface Node<C extends NodeConfig> {
        name: string
        desc: string
        options: Options
        config: C
    }

    /** Single group declaration configuration */
    export interface GroupConfig extends NodeConfig {
        globalOptions?: { [name: string]: OptionConfig }
        handle?: (group: Group) => boolean | any
        children?: NodeConfig[]
    }

    /** Single command declaration configuration */
    export interface CommandConfig extends NodeConfig {
        arguments?: { [name: string]: ArgumentConfig }
        handle?: (command: Command) => boolean | any
    }


    /** parsed options from a group or command its option declarations */
    export interface Options {
        [name: string]: any
        has: (name: string) => boolean
        get: <T extends any>(name: string, defaultValue?: any) => T
        getKeys(): string[]
        isEmpty(): boolean
        config(name: string): OptionConfig
        getConfig(): { [name: string]: OptionConfig | RootOptionConfig }

    }

    /** parsed arguments from a command its arguments declarations */
    export interface Arguments {
        [name: string]: any
        has: (name: string) => boolean
        get: <T extends any>(name: string, defaultValue?: any) => T
        getKeys(): string[]
        config(name: string): ArgumentConfig
        getConfig(): { [name: string]: ArgumentConfig }

    }

    /**  */
    export interface ArgumentTypeTransformer {
        (val: any): any
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

}

export { interfaces }
export default interfaces;