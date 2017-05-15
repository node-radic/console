import "reflect-metadata";
import { kindOf, KindOf } from "@radic/util";
import { merge } from "lodash";
import { cli } from "./Cli";
import { CommandConfig, HelperOptions, OptionConfig } from "./interfaces";
const callsites = require('callsites');


const get = Reflect.getMetadata;
const set = Reflect.defineMetadata;


function getCommandConfig<T extends CommandConfig>(cls: Function, args: any[] = []): T {
    const argt = args.map(kindOf),
          len  = args.length;

    let config: T = <T> {
        name       : cls.name.replace('Command', '').toLowerCase(),
        usage      : null,
        description: '',
        action     : 'handle',
        subCommands: [],
        argv       : process.argv,
        args       : process.argv.slice(2),
        cls
    };

    let sites = callsites();
    for ( let i = 0; i < sites.length; i ++ ) {
        if ( sites[ i ].getFunctionName() == '__decorate' ) {
            config.filePath = sites[ i ].getFileName()
            break;
        }
    }

    if ( argt[ 0 ] === "string" ) config.name = args[ 0 ]
    if ( len > 1 && argt[ 1 ] === 'string' ) config.description = args[ 1 ]
    if ( len > 2 && argt[ 2 ] === 'array' ) config.subCommands = args[ 2 ]

    if ( argt[ len - 1 ] === 'object' ) merge(config, args[ len - 1 ])

    return config;
}
function handleCommand(args: any[], cls?: Function) {

    if ( kindOf(args[ 0 ]) === 'function' ) {
        let cls    = args[ 0 ];
        let config = getCommandConfig<CommandConfig>(cls)
        set('command', config, cls);
        console.log('command', cls);
        cli.parse(config);
        return;
    }
    return (cls) => {
        let config = getCommandConfig<CommandConfig>(cls, args)
        set('command', config, cls);
        console.log('command', config, cls);
        cli.parse(config);
    }
}
export function command(cls: Function)
export function command(config: CommandConfig): ClassDecorator
export function command(name: string, config?: CommandConfig): ClassDecorator
export function command(name: string, description?: string, config?: CommandConfig): ClassDecorator
export function command(name: string, description?: string, subCommands?: string[], config?: CommandConfig): ClassDecorator
export function command(...args: any[]) {
    return handleCommand(args)
}


function getOptionConfig(cls: Object, key: string, args: any[]): OptionConfig {
    const argt = args.map(kindOf),
          len  = args.length;

    let config: OptionConfig = <OptionConfig> {
        key : '',
        name: '',
        type: null,
        cls
    };

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
    config.type = type;
    return config;
}
export function option(opt: any)
export function option(config: OptionConfig): PropertyDecorator
export function option(type: KindOf, config?: OptionConfig): PropertyDecorator
export function option(key: string, type: KindOf, config?: OptionConfig): PropertyDecorator
export function option(key: string, description: string, type?: KindOf, config?: OptionConfig): PropertyDecorator
export function option(...args: any[]): PropertyDecorator {

    if ( kindOf(args[ 0 ]) === 'function' ) {
        return;
    }

    return (cls: Object, propertyKey: string) => {

        let config    = getOptionConfig(cls, propertyKey, args)
        const options = get('options', cls) || [];
        options.push(config);
        set('options', options, cls);
        console.log('options', config, cls);
    }
}


function makeNodeConfig<T extends HelperOptions>(cls: any, args: any[]): T {
    let len       = args.length
    let argt      = args.map(arg => kindOf(arg));
    let config: T = <any> { cls };
    if ( len > 0 && argt[ 0 ] === 'string' ) config.name = args[ 0 ];

    // config is ALWAYS last parameter, so we can do it like this
    if ( len > 0 && argt[ len - 1 ] === 'object' ) merge(config, args[ len - 1 ]);
    return config;
}
export function helper(name: string): ClassDecorator;
export function helper(options: HelperOptions): ClassDecorator;
export function helper(name: string, options: HelperOptions): ClassDecorator;
export function helper(...args: any[]): ClassDecorator {
    return (cls) => {
        cli.addHelper(makeNodeConfig(cls, args));
    }
}
