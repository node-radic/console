import { YargsParserOptions } from 'yargs-parser';
import { CommandArgumentConfig, CommandConfig, Dictionary, OptionConfig, ParsedCommandArguments } from '../interfaces';
import { statSync } from 'fs';
import { basename, dirname, join, sep } from 'path';
import { defaults } from '../defaults';
import * as globule from 'globule';
import { Cli, container, ServiceIdentifier } from '../core';
import { kindOf } from '@radic/util';
import { kebabCase, merge } from 'lodash';
import { interfaces } from 'inversify';
import { Log } from '../modules/log/interfaces';

const callsites = require('callsites');

function bindFn<T>(id: ServiceIdentifier, fn) {
    container.bind<T>(id).toFunction(fn);
    container.bind(id.toString().replace('fn', 'factory')).toAutoFactory(id);
}

/** */
export type CommandConfigFunction = <T extends CommandConfig>(cls: Function, args?: any[]) => T

function getCommandConfig<T extends CommandConfig>(cls: Function, args: any[] = []): T {
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
    if ( argt[ 0 ] === 'string' ) config.name = args[ 0 ]
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

bindFn<CommandConfigFunction>('cli.fn.command.config', getCommandConfig);

/** */
export type OptionConfigFunction = (cls: Object, key: string, args: any[]) => OptionConfig;

function getOptionConfig(cls: Object, key: string, args: any[]): OptionConfig {
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
    try {
        let ins = new (<any> cls.constructor)
        let def = ins[ key ]
        if ( def && kindOf(def) === type ) {
            config.default = def;
        }
    } catch ( e ) {

    }

    config.name = kebabCase(config.name);
    config.type = type;
    return config;
}

bindFn<OptionConfigFunction>('cli.fn.options.config', getOptionConfig);


/** called in decorator, transforms config.name with all arguments to a proper structure */
export type PrepareArgumentsFunction = <T extends CommandConfig=CommandConfig>(config: T) => T

function prepareArguments<T extends CommandConfig = CommandConfig>(config: T): T {
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
            // required is encapsulated with {} instead of []
            arg.required         = match[ 0 ].startsWith('{');

            // build up a regular expression based on found characters in the argument string line
            // first check if the characters are present
            // then build up the 'exp' expression variable
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

            if ( hasDefault ) {
                // console.dir({name, matches,original,exp,arg})
                arg.default = JSON.parse(arg.default);
            }

            args.push(arg);
        })

        config.arguments = args;
    }
    config.name = config.name.split(/\s|\n/)[ 0 ];
    if ( config.name.includes('|') ) {
        let name       = config.name.split('\|')[ 0 ]
        let alias: any = config.name.split('\|')[ 1 ];
        // if alias is a number, the alias will be the starting letter(s) (depending on number value) of name
        if ( isFinite(alias) ) {
            alias = name.substring(0, parseInt(alias))
        }
        // prevent alias named same as name (makes no sense)
        if ( alias !== name ) {
            config.alias = alias
        }
        config.name = name;
    }

    return config;
}

bindFn<PrepareArgumentsFunction>('cli.fn.arguments.prepare', prepareArguments);


/**
 * Transforms a OptionConfig array (usually found on CommandConfig) to yargs-parser options.
 * This is used on the `cli:parse` event (fired in Cli#parse) and cli:execute:parse (fired in Cli#executeCommand)
 *
 * @see {Cli)
 */
export type TransformOptionsFunction = (configs: OptionConfig[]) => YargsParserOptions

function transformOptions(configs: OptionConfig[]): YargsParserOptions {
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
            'flatten-duplicate-arrays' : true
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

bindFn<TransformOptionsFunction>('cli.fn.options.transform', transformOptions);


/**
 * Used in the CLI, after parsing the argv, this arguments go to the handle for the command
 *
 * @param argv_
 * @param args
 * @returns {{arguments: {}, missing: Array, valid: boolean}}
 */
export type ParseArgumentsFunction = (argv_: string[], args?: CommandArgumentConfig[]) => ParsedCommandArguments

function parseArguments(argv_: string[], args: CommandArgumentConfig[] = []): ParsedCommandArguments {

    let invalid = [];
    let res     = {};
    args.forEach(arg => {
        let val: any = argv_[ arg.position ];

        if ( ! val && arg.required ) {
            invalid.push(arg.name);
        }

        if ( arg.variadic ) {
            val = argv_.slice(arg.position, argv_.length);
            if ( arg.default && val.length === 0 ) {
                val = JSON.parse(arg.default);
            }
        }


        if ( ! val && arg.default ) {
            val = JSON.parse(arg.default)
        }

        res[ arg.name ] = transformArgumentType(val, arg);

        if ( arg.alias ) {
            res[ arg.alias ] = res[ arg.name ];
        }
    })
    return { arguments: res, missing: invalid, valid: invalid.length === 0 };
}

bindFn<ParseArgumentsFunction>('cli.fn.arguments.parse', parseArguments);

/** */
export type TransformArgumentFunction = <T extends any = any>(val: any, arg: CommandArgumentConfig) => T | T[]

function transformArgumentType<T extends any = any>(val: any, arg: CommandArgumentConfig): T | T[] {
    const transformers = {
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
    if ( val === undefined ) {
        return undefined
    }
    if ( arg.variadic ) {
        if ( val === undefined ) {
            return []
        }
        return val.map((item => transformers [ arg.type ](item)));
    }
    if ( transformers[ arg.type ] ) {
        return transformers[ arg.type ](val);
    }
    return val;
}

transformArgumentType[ 'transformers' ] = {}
bindFn<TransformArgumentFunction>('cli.fn.arguments.transform', transformArgumentType);

/** */
export type SubCommandsFindFunction = (filePath: string) => string[]

function findSubCommandsPaths(filePath: string): string[] {

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

bindFn<SubCommandsFindFunction>('cli.fn.commands.find', findSubCommandsPaths);

/** */
export type SubCommandsGetFunction = <T extends Dictionary<CommandConfig> | CommandConfig[]>(filePath: string, recursive?: boolean, asArray?: boolean) => T

function getSubCommands<T extends Dictionary<CommandConfig> | CommandConfig[]>(filePath: string, recursive: boolean = false, asArray: boolean = false): T {
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

bindFn<SubCommandsGetFunction>('cli.fn.commands.get', getSubCommands);
