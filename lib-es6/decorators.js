import "reflect-metadata";
import { kindOf } from "@radic/util";
import { merge } from "lodash";
import { container } from "./core";
import { getCommandConfig, getOptionConfig } from "./utils";
import { decorate, injectable } from "inversify";
var get = Reflect.getMetadata;
var set = Reflect.defineMetadata;
export function command() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var handle = function (cls) {
        var config = getCommandConfig(cls, args);
        set('command', config, cls);
        if (!config.enabled)
            return;
        container.get('cli').parse(config);
    };
    if (kindOf(args[0]) === 'function') {
        return handle(args[0]);
    }
    return function (cls) {
        decorate(injectable(), cls);
        return handle(cls);
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
        var config = getOptionConfig(cls, propertyKey, args);
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
        container.get('cli').helpers.addHelper(makeNodeConfig(cls, args));
    };
}
