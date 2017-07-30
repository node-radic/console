import { statSync } from "fs";
import { basename, dirname, join, sep } from "path";
import { defaults } from "./defaults";
import * as globule from "globule";
import { container } from "./core/Container";
import { kindOf } from "@radic/util";
import { kebabCase, merge } from "lodash";
var callsites = require('callsites');
export function getOptionConfig(cls, key, args) {
    var argt = args.map(kindOf), len = args.length, config = defaults.option(cls, key);
    config[key.length > 1 ? 'name' : 'key'] = key;
    var type = Reflect.getMetadata('design:type', cls, key);
    if (len > 0 && argt[0] === 'string')
        config.key = args[0];
    if (len > 1 && argt[1] === 'string')
        config.description = args[1];
    if (len > 1 && argt[1] === 'function')
        type = args[1];
    if (argt[len - 1] === 'object')
        merge(config, args[len - 1]);
    type = type !== undefined ? type.name.toString().toLowerCase() : config.type;
    if (config.type !== undefined && type === 'array') {
        config.array = true;
        type = config.type;
    }
    config.name = kebabCase(config.name);
    config.type = type;
    return config;
}
export function prepareArguments(config) {
    var name = config.name.replace(/\[\]/g, '__');
    var argumentPattern = /[{\[](.*)[}\]]/gm;
    if (argumentPattern.test(name)) {
        if (name.match(argumentPattern) === null)
            return config;
        var matches = [], myArr = void 0;
        while (myArr = argumentPattern.exec(name)) {
            matches.push(myArr);
        }
        var args_1 = [];
        matches.forEach(function (match, index) {
            var arg = defaults.argument(index);
            var original = match[1];
            arg.required = match[0].startsWith('{');
            var exp = '^(.*?)', hasAlias = original.includes('/'), hasType = original.includes(':'), isArray = original.includes('__'), hasDefault = original.includes('='), hasDesc = original.includes('@');
            if (hasAlias)
                exp += '\\/(.*?)';
            if (hasType)
                exp += ':(.*?)';
            if (isArray)
                exp += '__';
            if (hasDefault)
                exp += '=(.*?)';
            if (hasDesc)
                exp += '@(.*?)';
            exp += '$';
            var regexp = new RegExp(exp, 'gm');
            var res = regexp.exec(original);
            var $ = 1;
            arg.name = res[$++];
            if (hasAlias)
                arg.alias = res[$++];
            if (hasType)
                arg.type = res[$++];
            if (hasDefault)
                arg.default = res[$++];
            if (hasDesc)
                arg.description = res[$++];
            if (isArray)
                arg.variadic = true;
            if (hasDefault) {
                arg.default = JSON.parse(arg.default);
            }
            args_1.push(arg);
        });
        config.arguments = args_1;
        config.name = config.name.split(/\s|\n/)[0];
        if (config.name.includes('|')) {
            config.name = config.name.split('|')[0];
            config.alias = config.name.split('|')[1];
        }
    }
    return config;
}
export function getCommandConfig(cls, args) {
    if (args === void 0) { args = []; }
    var argt = args.map(kindOf), len = args.length, config = defaults.command(cls);
    var sites = callsites();
    for (var i = 0; i < sites.length; i++) {
        if (sites[i].getFunctionName() == '__decorate') {
            config.filePath = sites[i].getFileName();
            break;
        }
    }
    if (argt[0] === "string")
        config.name = args[0];
    if (len > 1 && argt[1] === 'string')
        config.description = args[1];
    if (len > 2 && argt[2] === 'array')
        config.subCommands = args[2];
    if (argt[len - 1] === 'object')
        merge(config, args[len - 1]);
    config = prepareArguments(config);
    config.description = config.description.toLowerCase();
    if (kindOf(config.enabled) === 'function') {
        config.enabled = config.enabled.apply(config, [container]);
    }
    return config;
}
export function transformOptions(configs) {
    var options = {
        array: [],
        boolean: [],
        string: [],
        number: [],
        count: [],
        coerce: {},
        alias: {},
        default: {},
        narg: {},
        normalize: true,
        configuration: {
            'short-option-groups': true,
            'camel-case-expansion': true,
            'dot-notation': true,
            'parse-numbers': true,
            'boolean-negation': true,
            'duplicate-arguments-array': true,
            'flatten-duplicate-arrays': true,
        }
    };
    configs.forEach(function (config, iconfig) {
        var key = config.key;
        var type = config.type || 'boolean';
        options.alias[key] = [config.name];
        if (config.count) {
            options.count.push(key);
            type = undefined;
            return;
        }
        if (config.array === true)
            options.array.push(key);
        if (config.transformer)
            options.coerce[key] = config.transformer;
        if (config.arguments)
            options.narg[key] = config.arguments;
        if (config.default)
            options.default[key] = config.default;
        if (type !== undefined && options[type] !== undefined) {
            options[type].push(key);
            configs[iconfig]['type'] = type;
        }
    });
    return options;
}
export function parseArguments(argv_, args) {
    if (args === void 0) { args = []; }
    var invalid = [];
    var res = {};
    args.forEach(function (arg) {
        var val = argv_[arg.position];
        if (!val && arg.required) {
            invalid.push(arg.name);
        }
        if (arg.variadic) {
            val = argv_.slice(arg.position, argv_.length);
            if (arg.default && val.length === 0) {
                val = JSON.parse(arg.default);
            }
        }
        if (!val && arg.default) {
            val = JSON.parse(arg.default);
        }
        res[arg.name] = transformArgumentType(val, arg);
        if (arg.alias) {
            res[arg.alias] = res[arg.name];
        }
    });
    return { arguments: res, missing: invalid, valid: invalid.length === 0 };
}
export function transformArgumentType(val, arg) {
    if (val === undefined) {
        return undefined;
    }
    if (arg.variadic) {
        if (val === undefined) {
            return [];
        }
        return val.map((function (item) { return transformArgumentType['transformers'][arg.type](item); }));
    }
    if (transformArgumentType['transformers'][arg.type]) {
        return transformArgumentType['transformers'][arg.type](val);
    }
    return val;
}
transformArgumentType['transformers'] = {
    boolean: function (val) {
        return val === 'true' || val === true || val === '1';
    },
    number: function (val) {
        return parseInt(val);
    },
    string: function (val) {
        return typeof val.toString === 'function' ? val.toString() : val;
    }
};
export function findSubCommandsPaths(filePath) {
    var dirName = dirname(filePath);
    var baseName = basename(filePath, '.js');
    var locations = [
        join(dirName, baseName + '-*.js'),
        join(dirName, baseName + '.*.js'),
        join(dirName, baseName + '_*.js'),
        join(dirName, baseName + sep + '*.js')
    ];
    var paths = [];
    locations.forEach(function (location) {
        globule.find(location).forEach(function (modulePath) {
            var stat = statSync(modulePath);
            if (stat.isSymbolicLink()) {
                container.get('cli.log').notice('Trying to access symlinked command. Not sure if it\'l work');
                paths.push(modulePath);
            }
            if (stat.isFile()) {
                paths.push(modulePath);
            }
        });
    });
    return paths;
}
export function getSubCommands(filePath, recursive, asArray) {
    if (recursive === void 0) { recursive = false; }
    if (asArray === void 0) { asArray = false; }
    var subCommands = {};
    if (asArray) {
        subCommands = [];
    }
    var cli = container.get('cli');
    cli.parseCommands = false;
    findSubCommandsPaths(filePath).forEach(function (modulePath) {
        var module = require(modulePath);
        if (kindOf(module.default) !== 'function')
            return;
        var command = Reflect.getMetadata('command', module.default);
        if (!command || !command.enabled) {
            return;
        }
        if (recursive && command.isGroup) {
            command.subCommands = getSubCommands(command.filePath, recursive, asArray);
        }
        if (asArray) {
            subCommands.push(command);
            return;
        }
        subCommands[command.name] = command;
        if (command.alias) {
            subCommands[command.alias] = command;
        }
    });
    cli.parseCommands = true;
    return subCommands;
}
