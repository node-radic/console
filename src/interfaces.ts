import { CliMode } from "./cli";
import { OptionType, ArgumentType, Group, Command, CliChildType } from "./cli-children";
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


    /** Declaration of a option */
    export interface OptionConfig {
        name?: string
        alias?: string
        desc?: string

        type?: OptionType
        array?: boolean
        default?: any
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

    /**  */
    export interface CliChildConfig extends Object {
        name?: string
        type?: CliChildType
        group?: any
        cls?: any
        options?: { [name: string]: OptionConfig }
        aliases?: string[]
        desc?: string
    }

    /** Single group declaration configuration */
    export interface GroupConfig extends CliChildConfig {
        globalOptions?: { [name: string]: OptionConfig }
        handle?: (group: Group) => boolean | any
        children?: CliChildConfig[]
    }

    /** Single command declaration configuration */
    export interface CommandConfig extends CliChildConfig {
        arguments?: { [name: string]: ArgumentConfig }
        handle?: (command: Command) => boolean | any
    }


    /** parsed options from a group or command its option declarations */
    export interface Options {
        [name: string]: any
        has: (name: string) => boolean
        get: <T extends any>(name: string, defaultValue?: any) => T
    }

    /** parsed arguments from a command its arguments declarations */
    export interface Arguments {
        [name: string]: any
        has: (name: string) => boolean
        get: <T extends any>(name: string, defaultValue?: any) => T
    }

    /**  */
    export interface ArgumentTypeTransformer {
        (val: any): any
    }


    export interface CliChild<C> {
        name: string
        desc: string
        options: interfaces.Options
        handle: () => boolean | void
        config: C
    }

    export interface Group extends CliChild<GroupConfig> {
    }

    export interface Command extends CliChild<CommandConfig> {
        arguments: interfaces.Arguments
    }


}

export { interfaces }
export default interfaces;