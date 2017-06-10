import { YargsParserOptions } from "../types/yargs-parser";
import { CommandArgumentConfig, CommandConfig, OptionConfig } from "./interfaces";
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

        if ( type !== undefined ) {
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
export function prepareArguments<T extends CommandConfig = CommandConfig>(config: T): T{
//https://regex101.com/r/vSqbuK/1
    let exp = /[{\[]([\w|]*?):([\w\[\]]*?)@(.*?)[}\]]/g;


    let exp1 = /[{\[](.*?)[}\]]/g

    if ( exp1.test(config.name) ) {
        let args = config.name.match(exp1)
        if ( args === null ) {
            return config
        }
        if ( false ===
            /.*?(:).*/g.test(config.name) &&
            /.*?(|).*/g.test(config.name) &&
            /.*?(@).*/g.test(config.name)
        ) {
            return config
        }


        config.arguments = args.map((match, index) => {
            let arg = defaults.argument(index);

            if ( match.startsWith('{') ) {
                arg.required = true;
            }
            if ( match.endsWith('..]') ) {
                arg.variadic = true;
            }
            arg.name = match.replace(/[\[\]\{\}\.]/g, '');

            if ( arg.name.includes('|') ) {
                let alias = arg.name.split('|')
                arg.name  = alias.shift();
                arg.alias = alias.shift();
            }

            if ( arg.name.includes(':') ) {
                let type = arg.name.split(':')
                arg.name = type.shift();
                arg.type = type.shift();
            }
            if ( arg.name.includes('@') ) {
                let desc = arg.name.split('@')
                let any  = desc.shift();
                arg.desc = desc.shift();
            }

            return arg;
        })
        config.name      = config.name.split(' ').shift();
    }
    return config;
}


/** Used in the CLI, after parsing the argv, this arguments go to the handle for the command */
export function parseArguments(argv_: string[], args: CommandArgumentConfig[] = []) {

    let requireArgument;
    let res = {};
    args.forEach(arg => {
        let val = argv_[ arg.position ];
        if ( ! val && arg.required && ! requireArgument ) {
            requireArgument = `Required argument <${arg.name}> not set`;
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
    return res;
}

export function transformArgumentType<T extends any>(val: any, to: T): T {
    if ( transformArgumentType[ 'transformers' ][ to ] ) {
        return transformArgumentType[ 'transformers' ][ to ](val);
    }
    return to;
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
