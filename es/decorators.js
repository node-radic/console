var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import "reflect-metadata";
import { kindOf } from "@radic/util";
import { merge } from "lodash";
import { container } from "./core";
import { decorate, injectable } from "inversify";
import { defaults } from "./defaults";
var callsites = require('callsites');
var get = Reflect.getMetadata;
var set = Reflect.defineMetadata;
export function command(name, description, config) {
    return function (cls) {
        // fix function overloading variables
        decorate(injectable(), cls);
        if (kindOf(description) === 'object') {
            config = description;
            description = '';
        }
        config = __assign({}, defaults.command(cls), config || {}, { name: name });
        config.description = description ? description.toString().toLowerCase() : config.description || '';
        config = container.get('cli.fn.arguments.prepare')(config);
        config.filePath = callsites().filter(function (site) { return site.getFunctionName() == '__decorate'; }).map(function (site) { return site.getFileName(); }).shift();
        config.enabled = kindOf(config.enabled) === 'function' ? config.enabled.apply(config, [container]) : config.enabled;
        config.alwaysRun = kindOf(get('alwaysRun', cls) === 'string') ? get('alwaysRun', cls) : config.alwaysRun;
        var options = get('options', cls.prototype) || [];
        set('options', config.options = options.concat(config.options), cls);
        set('command', config, cls);
    };
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
export function alwaysRun() {
    return function (cls, propertyKey, descriptor) {
        set('alwaysRun', propertyKey, cls.constructor);
    };
}
export function option() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (kindOf(args[0]) === 'function') {
        return;
    }
    return function (cls, propertyKey) {
        var config = container.get('cli.fn.options.config')(cls, propertyKey, args);
        var options = get('options', cls) || [];
        options.push(config);
        set('options', options, cls);
    };
}
function makeNodeConfig(cls, args) {
    var len = args.length;
    var argt = args.map(function (arg) { return kindOf(arg); });
    var config = { cls: cls };
    if (len > 0 && argt[0] === 'string')
        config.name = args[0];
    // config is ALWAYS last parameter, so we can do it like this
    if (len > 0 && argt[len - 1] === 'object')
        merge(config, args[len - 1]);
    return config;
}
export function helper() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return function (cls) {
        container.get('cli').helpers.add(makeNodeConfig(cls, args));
    };
}
