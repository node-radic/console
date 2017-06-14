import { YargsParserOptions } from "../types/yargs-parser";
import { CommandArgumentConfig, CommandConfig, OptionConfig, ParsedCommandArguments } from "./interfaces";
import { existsSync, statSync } from "fs";
import { basename, dirname, join, sep } from "path";
import { defaults } from "./defaults";
const callsites = require('callsites');

export function dumpCallsites() {

    let sites = callsites();
    for ( let i = 0; i < sites.length; i ++ ) {
        console.log(i, 'getTypeName', sites[ i ].getTypeName())
        console.log(i, 'getFileName', sites[ i ].getFileName())
        console.log(i, 'getFunctionName', sites[ i ].getFunctionName())
        console.log(i, 'getMethodName', sites[ i ].getMethodName())
        console.log(i, 'getFileName', sites[ i ].getFileName())
        console.log(i, 'getLineNumber', sites[ i ].getLineNumber())
        console.log(i, 'getColumnNumber', sites[ i ].getColumnNumber())
        console.log(i, 'getEvalOrigin', sites[ i ].getEvalOrigin())
        console.log(i, 'isToplevel', sites[ i ].isToplevel())
        console.log(i, 'isEval', sites[ i ].isEval())
        console.log(i, 'isNative', sites[ i ].isNative())
        console.log(i, 'isConstructor', sites[ i ].isConstructor())
    }
}


/** transforms my option structure to the yargs-parser option structure */
export function transformOptions(configs: OptionConfig[]): YargsParserOptions {
    let options: YargsParserOptions = {
        array        : [],
        boolean      : [],
        string       : [],
        number       : [],
        count        : [],
        // config?: boolean
        coerce       : {},
        alias        : {},
        default      : {},
        narg         : {},
        normalize    : true,
        configuration: {
            'short-option-groups'      : true,
            'camel-case-expansion'     : true,
            'dot-notation'             : true,
            'parse-numbers'            : true,
            'boolean-negation'         : true,
            'duplicate-arguments-array': true,
            'flatten-duplicate-arrays' : true,
        }
    };
    configs.forEach((config: OptionConfig, iconfig: number) => {
        let key  = config.key;
        let type = config.type || 'boolean';

        options.alias[ key ] = [ config.name ];

        if ( config.count ) {
            options.count.push(key)
            type = undefined
        }

        if ( config.array === true ) options.array.push(key);
        if ( config.transformer ) options.coerce[ key ] = config.transformer;
        if ( config.arguments ) options.narg[ key ] = config.arguments;
        if ( config.default ) options.default[ key ] = config.default

        if ( type !== undefined && options[type] !== undefined ) {
            options[ type ].push(key);
            configs[ iconfig ][ 'type' ] = type;
        }
    })
    return options;
}


export function findSubCommandFilePath(subCommand, filePath): string {
    let dirName  = dirname(filePath);
    let baseName = basename(filePath, '.js');
    // various locations to search for the sub-command file
    // this can, and "maby" should have a couple of more variations
    let locations     = [
        join(dirName, baseName + '-' + subCommand + '.js'),
        join(dirName, baseName + '.' + subCommand + '.js'),
        join(dirName, baseName + '_' + subCommand + '.js'),
        join(dirName, baseName + sep + subCommand + '.js')
    ]
    let foundFilePath = null;
    locations.forEach(location => {
        if ( foundFilePath ) return;
        if ( existsSync(location) ) {
            let stat = statSync(location);
            if ( stat.isSymbolicLink() ) {
                this.log.notice('Trying to access symlinked command. Not sure if it\'l work')
                foundFilePath = location
            }
            if ( stat.isFile() ) {
                foundFilePath = location
            }
        }
    })

    if ( null === foundFilePath ) {
        throw new Error(`Could not find sub-command [${subCommand}] for parent file [${filePath}]`);
    }

    return foundFilePath;
}

/** called in decorator, transforms config.name with all arguments to a proper structure */
export function prepareArguments<T extends CommandConfig = CommandConfig>(config: T): T {
//https://regex101.com/r/vSqbuK/1

    let name            = config.name.replace(/\[\]/g, '__')
    let argumentPattern = /[{|\[](.*?)[}|\]]/gm
    if ( argumentPattern.test(name) ) {
        if ( name.match(argumentPattern) === null )
            return config

        let matches = [], myArr
        while ( myArr = argumentPattern.exec(name) ) {
            matches.push(myArr);
        }

        let args: CommandArgumentConfig[] = [];
        matches.forEach((match, index) => {
            let arg              = defaults.argument(index);
            let original: string = match[ 1 ]
            arg.required         = match[ 0 ].startsWith('{');
            let exp              = '^(.*?)',
                hasAlias         = original.includes('/'),
                hasType          = original.includes(':'),
                isArray          = original.includes('__'),
                hasDesc          = original.includes('@')

            if ( hasAlias ) exp += '\\/(.*?)'
            if ( hasType ) exp += ':(.*?)';
            if ( isArray ) exp += '__'
            if ( hasDesc ) exp += '@(.*?)'
            exp += '$'

            let regexp = new RegExp(exp, 'gm');
            let res    = regexp.exec(original);

            let $    = 1;
            arg.name = res[ $ ++ ];
            if ( hasAlias ) arg.alias = res[ $ ++ ];
            if ( hasType ) arg.type = res[ $ ++ ]
            if ( hasDesc ) arg.desc = res[ $ ++ ]
            if ( isArray ) arg.variadic = true;

            args.push(arg);
        })
        config.arguments = args;
        config.name      = config.name.split(/\s|\n/)[ 0 ];
    }
    return config;
}

/** Used in the CLI, after parsing the argv, this arguments go to the handle for the command */
export function parseArguments(argv_: string[], args: CommandArgumentConfig[] = []): ParsedCommandArguments {

    let invalid = [];
    let res     = {};
    args.forEach(arg => {
        let val: any = argv_[ arg.position ];
        // val          = transformArgumentType<any>(val, arg);

        if ( ! val && arg.required ) {
            invalid.push(arg.name);
        }
        // val = transformArgumentType()
        if ( arg.variadic ) {
            if ( ! res[ arg.name ] ) {
                res[ arg.name ] = [ val ];
            } else {
                res[ arg.name ].push(val)
            }
        } else {
            res[ arg.name ] = val;
        }
        if ( arg.alias ) {
            res[ arg.alias ] = res[ arg.name ];
        }
    })
    return { arguments: res, missing: invalid, valid: invalid.length === 0 };
}

export function transformArgumentType<T extends any = any>(val: any, arg: CommandArgumentConfig): T | T[] {
    if ( val === undefined ) {
        return undefined
    }
    if ( arg.variadic ) {
        if ( val === undefined ) {
            return []
        }
        return val.map((item => transformArgumentType[ 'transformers' ][ arg.type ](item)));
    }
    if ( transformArgumentType[ 'transformers' ][ arg.type ] ) {
        return transformArgumentType[ 'transformers' ][ arg.type ](val);
    }
    return val;
}
transformArgumentType[ 'transformers' ] = {
    boolean(val: any): boolean {
        return val === 'true' || val === true || val === '1';
    },
    number(val: any): number {
        return parseInt(val);
    },
    string(val: any): string {
        return typeof val.toString === 'function' ? val.toString() : val;
    }
}
