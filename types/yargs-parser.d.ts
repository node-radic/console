
export interface YargsParserOptionsConfiguration {
    'short-option-groups'?: boolean
    'camel-case-expansion'?: boolean
    'dot-notation'?: boolean
    'parse-numbers'?: boolean
    'boolean-negation'?: boolean
    'duplicate-arguments-array'?: boolean
    'flatten-duplicate-arrays'?: boolean
}
interface YargsParserOptions extends Object {
    array?: string[]
    boolean?: string[]
    config?: boolean
    count?: string[]
    string?: string[]
    number?: string[]
    coerce?: { [key: string]: Function }
    alias?: { [key: string]: string[] }
    default?: { [key: string]: any }
    narg?: { [key: string]: number }

    envPrefix?: string
    normalize?: boolean
    configuration?: YargsParserOptionsConfiguration
}

interface YargsParserArgv {
    _?: any[],
    [key: string]: any
}
interface YargsParserDetailed {
    argv?: YargsParserArgv
    error?: Error
    aliases?: any[]
    newAliases?: any[]
    configuration?: any
}

interface YargsParser {
    (args?: string|string[], opts?: YargsParserOptions): YargsParserArgv
    detailed(args?: string|string[], opts?: YargsParserOptions): YargsParserDetailed
}
