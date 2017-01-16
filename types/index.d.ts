///<reference path="winston.d.ts" />
///<reference path="underscore.string.d.ts"/>
///<reference path="lowdb.d.ts"/>
///<reference path="validatorjs.d.ts"/>
///<reference path="../node_modules/@types/shelljs/index.d.ts"/>

interface YargsParserOptions {
    alias: { [key: string]: string[] }
    array: string[]
    boolean: string[]
    config?: boolean
    coerce: { [key: string]: Function }
    count: string[]
    string: string[]
    number: string[]
    default: { [key: string]: any }
    narg: { [key: string]: number }

    envPrefix?: string
    normalize?: boolean
    configuration?: { [key: string]: boolean }
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

declare module "yargs-parser" {
    var yp: YargsParser;
    export = yp;
}

declare module "events";
// declare module "fs";


interface CliTable extends Array<string[]> {

}
declare module "cli-table2" {
    interface TableConstructor {
        new (options?: any): CliTable
    }

    let t: TableConstructor;

    export = t
}


declare module "color-convert";
declare module "color-string";
declare module "trucolor";
declare module "globule";


declare module "window-size" {
    interface WindowSize {
        height: number
        width: number
    }
    let ws: WindowSize
    export = ws
}

declare module "headway"
declare module "cmdify"
declare module "blessed-contrib"
declare module "cli-spinner"
declare module "clui"

// to encrypt/decrypt low db
declare module "cryptr"

declare module "cryptico"

/** @link https://www.npmjs.com/package/marked-terminal */
declare module "marked-terminal"


// declare module "cli-table2"
declare module "graceful-readlink"

// others
declare module "globule" {
    interface Globule {
        find(str: string): string[]
    }
    var globule: Globule;
    export = globule;
}

interface IBitbucketRestClient {

}
interface IBitbucketRest {
    connectClient(opts: any): IBitbucketRestClient

}

declare module "bitbucket-rest" {
    var bitbucket: IBitbucketRest;
    export = bitbucket;
}

interface ErrorConstructor {
    prepareStackTrace(error?: any, structuredStackTrace?: any): any[];
}
interface ErrorStack {
    getTypeName(): string;
    getFunctionName(): string;
    getMethodName(): string;
    getFileName(): string;
    getTypeName(): string;
    getLineNumber(): number;
    getColumnNumber(): number;
    isNative(): boolean;
}
interface ErrorWithStack {
    stack: ErrorStack;
    name: string;
    message: string;
}
interface Yargonaut {
    help(font?: any): Yargonaut
    errors(font?: any): Yargonaut
    font(font?: any, key ?: any): Yargonaut
    helpStyle(style ?: any): Yargonaut
    errorsStyle(style?: any): Yargonaut
    style(style?: any, key ?: any): Yargonaut
    transformWholeString(key): Yargonaut
    transformUpToFirstColon(key): Yargonaut
    ocd(f?: any): Yargonaut
    getAllKeys(): string[]
    getHelpKeys(): string[]
    getErrorKeys(): string[]
    asFont(text?: any, font?: any, throwErr ?: any): any
    listFonts(): void
    printFont(font?: any, text?: any, throwErr?: any): void
    printFonts(text?: any, throwErr ?: any): void
    figlet(): any
    chalk(): any

}
declare module 'yargonaut' {
    var yargonaut: Yargonaut;
    export = yargonaut;
}

declare module "get-caller-file" {

}

interface DotEnv {
    parse(buf: string): any;
    config(options?: { silent: boolean, path: string, encoding: string })
}
declare module "dotenv" {
    var dotenvv: DotEnv
    export = dotenvv
}

interface IClIUI {
    (opts: any): IClIUI
    span()
    div(...opts: any[])
    toString()
    rowToString()
}
declare module "cliui" {
    var cliui: IClIUI;
    export = cliui;
}


declare module "lastpass" {
    interface Lastpass {

        loadVault(username?: string, password?: string, twoFactor?: string): Promise<any>
        loadVaultFile(vaultFile?: string): Promise<any>
        saveVaultFile(vaultFile?: string, options?: any): Promise<any>
        getVault()
        getAccounts(username?: string, password?: string, search?: any): Promise<Array<any>>
    }

    interface LastpassConstructor {
        new(username?: string): Lastpass
    }

    var Lastpass: LastpassConstructor
    export default Lastpass
}

