import "reflect-metadata";
import { kindOf, KindOf } from "@radic/util";
import { merge } from "lodash";
import { CommandConfig, HelperOptions, OptionConfig } from "./interfaces";
import { Cli, container } from "./core";
import { getCommandConfig, getOptionConfig } from "./utils";
import { decorate, injectable } from "inversify";


const get = Reflect.getMetadata;
const set = Reflect.defineMetadata;

export function command(cls: Function)
export function command(config: CommandConfig): ClassDecorator
export function command(name: string, config?: CommandConfig): ClassDecorator
export function command(name: string, description?: string, config?: CommandConfig): ClassDecorator
export function command(name: string, description?: string, subCommands?: string[], config?: CommandConfig): ClassDecorator
export function command(...args: any[]) {
    const handle = (cls) => {
        let config = getCommandConfig<CommandConfig>(cls, args)
        set('command', config, cls);
        container.get<Cli>('cli').parse(config);
    }

    if ( kindOf(args[ 0 ]) === 'function' ) {
        return handle(args[ 0 ]);
    }
    return (cls) => {
        decorate(injectable(), cls);
        return handle(cls);
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
        container.get<Cli>('cli').helpers.addHelper(makeNodeConfig(cls, args));
    }
}
