interface YargsParserOptions
{
    alias: {[key: string]: string[]}
    array: string[]
    boolean: string[]
    config?: boolean
    coerce: {[key: string]: Function}
    count: string[]

    default: {[key: string]: any}
    envPrefix?: string
    narg: {[key: string]: number}
    normalize?: boolean
    string: string[]
    configuration?: {[key: string]: boolean}
    number: string[]
}
interface YargsParserArgv
{
    _?: any[],
    [key: string]: any
}
interface YargsParserDetailed
{
    argv?: YargsParserArgv
    error?: Error
    aliases?: any[]
    newAliases?: any[]
    configuration?: any
}

interface YargsParser
{
    (args?: string|string[], opts?: YargsParserOptions): YargsParserArgv
    detailed(args?: string|string[], opts?: YargsParserOptions): YargsParserDetailed
}

declare module "yargs-parser"
{
    var yp: YargsParser;
    export = yp;
}

declare module "events";
declare module "fs";


interface CliTable extends Array<string[]> {

}
declare module "cli-table2" {
    interface TableConstructor {
        new (options?:any): CliTable
    }

    let t:TableConstructor;

    export = t
}


declare module "color-convert";
declare module "color-string";
declare module "trucolor";
