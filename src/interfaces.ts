import { CliMode } from "./core/Cli";
import { ArgumentType, NodeType, OptionType } from "./core/nodes";
import { ParsedNode } from "./parser/ParsedNode";
namespace interfaces {

    /**  */
    export interface CliConfig {
        /** group for a 'git' like cli. command for 1 command with */
        mode?: CliMode
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

    /** yargs-parser configuration */
    export interface ParserOptionsConfig extends Object {
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
        configuration?: ParserConfiguration
    }

    /** yargs-parser detailed output arv */
    export interface ParserOutputArgv {
        _?: any[],
        [key: string]: any
    }

    /** yargs-parser parsed argv detailed output */
    export interface ParserOutput {
        argv?: ParserOutputArgv
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
        global?: boolean

        transformer?: (arg: any) => any
        arguments?: number
        count?: number
    }


    /** Declaration of a argument */
    export interface ArgumentConfig {
        name?: string
        desc?: string
        required?: boolean
        type?: ArgumentType
        default?: any
    }



    export interface DecoratedConfig<C extends OptionConfig | ArgumentConfig > {
        cls?: Function
        key?: string | symbol
        config?: C
        type?: any
    }


    /**  */
    export interface NodeConfig { //extends Object
        [name: string]: any
        name?: string
        type?: NodeType
        group?: any
        cls?: any
        options?: { [name: string]: OptionConfig }
        instance?: ParsedNode<this> | null
        aliases?: string[]
        desc?: string
    }

    /** Single group declaration configuration */
    export interface GroupNodeConfig extends NodeConfig {
        globalOptions?: { [name: string]: OptionConfig }
        handle?: () => void
    }

    /** Single command declaration configuration */
    export interface CommandNodeConfig extends NodeConfig {
        arguments?: { [name: string]: ArgumentConfig }
        handle?: () => void
    }


    export interface NodesDefaults {
        argument: ArgumentConfig
        option: OptionConfig
        node: NodeConfig
        group: GroupNodeConfig
        command: CommandNodeConfig
    }


    /** parsed options from a group or command its option declarations */
    export interface Options {
        [name: string]: any
        has: (name: string) => boolean
        get: <T extends any>(name: string, defaultValue?: any) => T
        getKeys(): string[]
        isEmpty(): boolean
        config(name: string): OptionConfig
        getConfig(): { [name: string]: OptionConfig  }

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

    export interface Node<C extends NodeConfig> {
        parsed?: ParsedNode<C>
        handle?: () => void
    }

}

export { interfaces }
export default interfaces;