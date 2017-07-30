import { YargsParserOptions } from "../types/yargs-parser";
import { CommandArgumentConfig, CommandConfig, Dictionary, OptionConfig, ParsedCommandArguments } from "./interfaces";
import { statSync } from "fs";
import { basename, dirname, join, sep } from "path";
import { defaults } from "./defaults";
import * as globule from "globule";
import { container } from "./core/Container";
import { Log } from "./core/Log";
import { kindOf } from "@radic/util";
import { kebabCase, merge } from "lodash";
import { Cli } from "./core/Cli";
const callsites = require('callsites');

// region: decorator utils

/**
 *
 * @param cls
 * @param key
 * @param args
 * @returns {OptionConfig}
 */
export function getOptionConfig(cls: Object, key: string, args: any[]): OptionConfig {
    let argt                 = args.map(kindOf),
        len                  = args.length,
        config: OptionConfig = defaults.option(cls, key);


    config[ key.length > 1 ? 'name' : 'key' ] = key;
    let type                                  = Reflect.getMetadata('design:type', cls, key)


    if ( len > 0 && argt[ 0 ] === 'string' ) config.key = args[ 0 ];
    if ( len > 1 && argt[ 1 ] === 'string' ) config.description = args[ 1 ];
    if ( len > 1 && argt[ 1 ] === 'function' ) type = args[ 1 ];

    if ( argt[ len - 1 ] === 'object' ) merge(config, args[ len - 1 ])

    type = type !== undefined ? type.name.toString().toLowerCase() : config.type;
    if ( config.type !== undefined && type === 'array' ) {
        config.array = true;
        type         = config.type
    }

    config.name = kebabCase(config.name);
    config.type = type;
    return config;
}

/** called in decorator, transforms config.name with all arguments to a proper structure */
export function prepareArguments<T extends CommandConfig = CommandConfig>(config: T): T {
//https://regex101.com/r/vSqbuK/1

    let name            = config.name.replace(/\[\]/g, '__')
    let argumentPattern = /[{\[](.*)[}\]]/gm
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
                hasDefault       = original.includes('='),
                hasDesc          = original.includes('@')

            if ( hasAlias ) exp += '\\/(.*?)'
            if ( hasType ) exp += ':(.*?)'
            if ( isArray ) exp += '__'
            if ( hasDefault ) exp += '=(.*?)'
            if ( hasDesc ) exp += '@(.*?)'
            exp += '$'

            let regexp = new RegExp(exp, 'gm');
            let res    = regexp.exec(original);

            let $    = 1;
            arg.name = res[ $ ++ ];
            if ( hasAlias ) arg.alias = res[ $ ++ ];
            if ( hasType ) arg.type = res[ $ ++ ]
            if ( hasDefault ) arg.default = res[ $ ++ ]
            if ( hasDesc ) arg.description = res[ $ ++ ]
            if ( isArray ) arg.variadic = true;

            if(hasDefault){
                // console.dir({name, matches,original,exp,arg})
                arg.default = JSON.parse(arg.default);
            }

            args.push(arg);
        })
        config.arguments = args;
        config.name      = config.name.split(/\s|\n/)[ 0 ];
        if ( config.name.includes('|') ) {
            config.name  = config.name.split('|')[ 0 ]
            config.alias = config.name.split('|')[ 1 ]
        }
    }
    return config;
}

/**
 *
 * @param cls
 * @param args
 * @returns {T}
 */
export function getCommandConfig<T extends CommandConfig>(cls: Function, args: any[] = []): T {
    let argt                         = args.map(kindOf),
        len = args.length, config: T = defaults.command<T>(cls);

    let sites = callsites();
    for ( let i = 0; i < sites.length; i ++ ) {
        if ( sites[ i ].getFunctionName() == '__decorate' ) {
            config.filePath = sites[ i ].getFileName()
            break;
        }
    }

    // convert args into config
    if ( argt[ 0 ] === "string" ) config.name = args[ 0 ]
    if ( len > 1 && argt[ 1 ] === 'string' ) config.description = args[ 1 ]
    if ( len > 2 && argt[ 2 ] === 'array' ) config.subCommands = args[ 2 ]
    if ( argt[ len - 1 ] === 'object' ) merge(config, args[ len - 1 ])

    // transform / format / handle the config
    config             = prepareArguments(config);
    config.description = config.description.toLowerCase();
    if ( kindOf(config.enabled) === 'function' ) {
        config.enabled = (<Function>config.enabled).apply(config, [ container ])
    }

    return config;
}

// endregion


// region: cli utils

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
            return
        }

        if ( config.array === true ) options.array.push(key);
        if ( config.transformer ) options.coerce[ key ] = config.transformer;
        if ( config.arguments ) options.narg[ key ] = config.arguments;
        if ( config.default ) options.default[ key ] = config.default

        if ( type !== undefined && options[ type ] !== undefined ) {
            options[ type ].push(key);
            configs[ iconfig ][ 'type' ] = type;
        }
    })
    return options;
}

/**
 * Used in the CLI, after parsing the argv, this arguments go to the handle for the command
 *
 * @param argv_
 * @param args
 * @returns {{arguments: {}, missing: Array, valid: boolean}}
 */
export function parseArguments(argv_: string[], args: CommandArgumentConfig[] = []): ParsedCommandArguments {

    let invalid = [];
    let res     = {};
    args.forEach(arg => {
        let val: any = argv_[ arg.position ];

        if ( ! val && arg.required ) {
            invalid.push(arg.name);
        }

        if ( arg.variadic ) {
            val = argv_.slice(arg.position, argv_.length);
            if(arg.default && val.length === 0){
                val = JSON.parse(arg.default);
            }
        }

        if(!val && arg.default){
            val = JSON.parse(arg.default)
        }

        res[ arg.name ] = transformArgumentType(val, arg);

        if ( arg.alias ) {
            res[ arg.alias ] = res[ arg.name ];
        }
    })
    return { arguments: res, missing: invalid, valid: invalid.length === 0 };
}

/**
 *
 * @param val
 * @param arg
 * @returns {any}
 */
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

/**
 *
 * @param filePath
 * @returns {Array}
 */
export function findSubCommandsPaths(filePath): string[] {

    let dirName  = dirname(filePath);
    let baseName = basename(filePath, '.js');
    // various locations to search for the sub-command file
    // this can, and "maby" should have a couple of more variations
    let locations = [
        join(dirName, baseName + '-*.js'),
        join(dirName, baseName + '.*.js'),
        join(dirName, baseName + '_*.js'),
        join(dirName, baseName + sep + '*.js')
    ]
    let paths     = [];
    locations.forEach(location => {
        globule.find(location).forEach(modulePath => {
            let stat = statSync(modulePath);
            if ( stat.isSymbolicLink() ) {
                container.get<Log>('cli.log').notice('Trying to access symlinked command. Not sure if it\'l work')
                paths.push(modulePath)
            }
            if ( stat.isFile() ) {
                paths.push(modulePath)
            }
        })
    });
    return paths;
}

export function getSubCommands<T extends Dictionary<CommandConfig> | CommandConfig[]>(filePath: string, recursive: boolean = false, asArray: boolean = false): T {
    let subCommands: any = {}
    if ( asArray ) {
        subCommands = [];
    }

    const cli         = container.get<Cli>('cli');
    cli.parseCommands = false
    findSubCommandsPaths(filePath).forEach(modulePath => {
        const module = require(modulePath);
        if ( kindOf(module.default) !== 'function' ) return;
        const command: CommandConfig = Reflect.getMetadata('command', module.default);
        if ( ! command || ! command.enabled ) {
            return
        }

        if ( recursive && command.isGroup ) {
            command.subCommands = getSubCommands<T>(command.filePath, recursive, asArray)
        }


        if ( asArray ) {
            subCommands.push(command)
            return;
        } // else
        subCommands[ command.name ] = command;
        if ( command.alias ) {
            subCommands[ command.alias ] = command;
        }
    })
    cli.parseCommands = true
    return subCommands
}

// endregion
