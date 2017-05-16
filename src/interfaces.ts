import { KindOf } from "@radic/util";
export interface CommandConfig {
    name?: string
    usage?: string | null
    description?: string
    subCommands?: string[]
    cls?: Function
    filePath?: string
    action?: Function | string
    argv?: string[]
    args?: string[]
}

export interface OptionConfig {

    transformer?: Function;
    arguments?: number;
    count?: boolean;
    description?: any;
    default?: any
    key?: string
    name?: string
    type?: KindOf
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