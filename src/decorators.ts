import "reflect-metadata";
import { kindOf, KindOf } from "@radic/util";
import { merge } from "lodash";
import { CommandConfig, HelperOptions, OptionConfig } from "./interfaces";
import { Cli, container } from "./core";
import { CommandConfigFunction, OptionConfigFunction, PrepareArgumentsFunction } from "./utils";
import { decorate, injectable } from "inversify";
import { defaults } from "./defaults";
import { HelperOptionsConfig } from "./interfaces";
const callsites = require('callsites');

const get = Reflect.getMetadata;
const set = Reflect.defineMetadata;

export function command(name: string, config?: CommandConfig): ClassDecorator
export function command(name: string, description?: string, config?: CommandConfig): ClassDecorator
export function command(name: string, description?: string | CommandConfig, config?: CommandConfig): ClassDecorator {
    return (cls) => {
        // fix function overloading variables
        decorate(injectable(), cls)
        if ( kindOf(description) === 'object' ) {
            config      = <CommandConfig> description;
            description = '';
        }
        config = {
            ...defaults.command(cls),
            ...config || {},
            name
        }
        config.description = description ? description.toString().toLowerCase() : config.description || ''
        config = container.get<PrepareArgumentsFunction>('cli.fn.arguments.prepare')(config);

        config.filePath  = callsites().filter(site => site.getFunctionName() == '__decorate').map(site => site.getFileName()).shift()
        config.enabled   = kindOf(config.enabled) === 'function' ? (<Function>config.enabled).apply(config, [ container ]) : config.enabled;
        config.alwaysRun = kindOf(get('alwaysRun', cls) === 'string') ? get('alwaysRun', cls) : config.alwaysRun

        const options = <OptionConfig[]>get('options', cls.prototype) || [];
        set('options', config.options = options.concat(config.options), cls);

        set('command', config, cls);
    }
}
// export function command(cls: Function)
// export function command(config: CommandConfig): ClassDecorator
// export function command(name: string, config?: CommandConfig): ClassDecorator
// export function command(name: string, description?: string, config?: CommandConfig): ClassDecorator
// export function command(name: string, description?: string, subCommands?: string[], config?: CommandConfig): ClassDecorator
// export function command(...args: any[]) {
//     const handle = (cls) => {
//         let config = container.get<CommandConfigFunction>('cli.fn.command.config')<CommandConfig>(cls, args)
//         set('command', config, cls);
//         if(kindOf(get('alwaysRun', cls) === 'string')){
//             config.alwaysRun = get('alwaysRun', cls)
//         }
//
//         if ( ! config.enabled ) return;
//         // container.get<Cli>('cli').parse(config);
//     }
//
//     if ( kindOf(args[ 0 ]) === 'function' ) {
//         return handle(args[ 0 ]);
//     }
//     return (cls) => {
//         decorate(injectable(), cls);
//         return handle(cls);
//     }
// }


export function alwaysRun():MethodDecorator {
    return <T extends any>(cls:Object, propertyKey:string, descriptor: TypedPropertyDescriptor<T>) => {
        set('alwaysRun', propertyKey, cls.constructor);
    }
}

export function option(opt: any)
export function option(config: OptionConfig): PropertyDecorator
export function option(type: KindOf, config?: OptionConfig): PropertyDecorator
export function option(key: string, type: KindOf, config?: OptionConfig): PropertyDecorator
export function option(key: string, description: string, config?: OptionConfig): PropertyDecorator
export function option(key: string, description: string, type?: KindOf, config?: OptionConfig): PropertyDecorator
export function option(...args: any[]): PropertyDecorator {
    if ( kindOf(args[ 0 ]) === 'function' ) {
        return;
    }
    return (cls: Object, propertyKey: string) => {
        let config    = container.get<OptionConfigFunction>('cli.fn.options.config')(cls, propertyKey, args)
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
export function helper<T extends HelperOptionsConfig>(options: HelperOptions<HelperOptionsConfig>): ClassDecorator;
export function helper<K extends keyof HelperOptionsConfig>(name: K, options: HelperOptions<HelperOptionsConfig[K]>): ClassDecorator;
export function helper(...args: any[]): ClassDecorator {
    return (cls) => {
        container.get<Cli>('cli').helpers.add(makeNodeConfig(cls, args));
    }
}
