"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var parser = require("yargs-parser");
var ioc_1 = require("./ioc");
var ParsedOptions = (function () {
    function ParsedOptions(options) {
        var _this = this;
        Object.keys(options).forEach(function (key) {
            if (key === '_')
                return;
            _this[key] = options[key];
        });
    }
    ParsedOptions.prototype.has = function (name) {
        return this[name] !== undefined;
    };
    ParsedOptions.prototype.get = function (name, defaultValueOverride) {
        return this.has(name) ? this[name] : defaultValueOverride !== undefined ? defaultValueOverride : undefined;
    };
    ;
    return ParsedOptions;
}());
exports.ParsedOptions = ParsedOptions;
var Parser = (function () {
    function Parser() {
    }
    Parser.prototype.setArgv = function (argv) {
        this.argv = argv;
    };
    Parser.prototype.transformOptionsConfig = function (optionsConfig) {
        var options = {
            alias: {},
            array: [],
            boolean: [],
            string: [],
            number: [],
            coerce: {},
            count: [],
            default: {},
            narg: {},
            normalize: true,
            configuration: {}
        };
        Object.keys(optionsConfig).forEach(function (name) {
            var config = optionsConfig[name];
            options[config.type].push(name);
            options.alias[name] = [];
            if (config.alias)
                options.alias[name].push(config.alias);
            if (config.array)
                options.array.push(name);
            if (config.default)
                options.default[name] = config.default;
        });
        return options;
    };
    Parser.prototype.options = function (optionsConfig) {
        var optionsParserConfig = this.transformOptionsConfig(optionsConfig);
        var parsed = parser.detailed(this.argv, optionsParserConfig);
        parsed.optionsParserConfig = optionsParserConfig;
        parsed.options = new ParsedOptions(this.parsed.argv);
        parsed.optionsConfig = optionsConfig;
        return parsed;
    };
    Parser.prototype.arguments = function (args, argumentsConfig) {
        Object.keys(argumentsConfig).forEach(function (name, i) {
            var argument = argumentsConfig.arguments[name];
            if (args.argv._[i] === undefined) {
                if (argument.required) {
                    throw Error("Argument " + i + ":" + name + " is required ");
                }
                return;
            }
        });
        return {};
    };
    Parser.prototype.group = function (config) {
        return this.options(config.options);
    };
    Parser.prototype.command = function (argv, config) {
        var parsed = this.options(config.options);
        parsed.arguments = this.arguments(parser.detailed(argv), config.arguments);
        return parsed;
    };
    return Parser;
}());
Parser = __decorate([
    ioc_1.Container.bind('console.parser')
], Parser);
exports.Parser = Parser;
exports.default = Parser;
