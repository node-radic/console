import "reflect-metadata";
import { kindOf, KindOf } from "@radic/util";
import { merge } from "lodash";
import { CommandConfig, HelperOptions, OptionConfig } from "./interfaces";
import { Cli, container } from "./core";
import { defaults } from "./defaults";
const callsites = require('callsites');


const get = Reflect.getMetadata;
const set = Reflect.defineMetadata;

function getCommandConfig<T extends CommandConfig>(cls: Function, args: any[] = []): T {
    const argt = args.map(kindOf),
          len  = args.length;

    let config: T = defaults.command<T>(cls);

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

    const isForked     = ! ! process.send
    const handle       = (cls) => {
        let config = getCommandConfig<CommandConfig>(cls, args)
        set('command', config, cls);
        container.get<Cli>('cli').parse(config);
    }
    const forkedHandle = (cls) => {
        process.on('message', (m: any) => {
            console.log('GOT MSG', m, typeof m)
            container.get<Cli>('cli').config.set(m.config)
            let enabledHelpers = <string[]> container.get<Cli>('cli').config.get('enabledHelpers', []);
            // enabledHelpers.forEach(name => container.get<Cli>('cli').startHelper(name))
            handle(cls);
        });
    }

    if ( kindOf(args[ 0 ]) === 'function' ) {
        return isForked ? forkedHandle(args[ 0 ]) : handle(args[ 0 ]);
    }
    return (cls) => {
        return isForked ? forkedHandle(cls) : handle(cls);
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

    let config: OptionConfig = defaults.option(cls, key);


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
        container.get<Cli>('cli').addHelper(makeNodeConfig(cls, args));
    }
}
