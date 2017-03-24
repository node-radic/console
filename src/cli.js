"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ioc_1 = require("./ioc");
var registry_1 = require("./registry");
var util_1 = require("@radic/util");
var parser_1 = require("./parser");
var config_1 = require("./config");
var router_1 = require("./router");
var Cli = (function () {
    function Cli(registry, parser, router) {
        this._registry = registry;
        this._parser = parser;
        this.config = config_1.default;
    }
    Cli.getInstance = function () {
        return ioc_1.Container.getInstance().make('console.cli');
    };
    Cli.prototype.parse = function (argv) {
        this.argv = argv || process.argv.slice(2);
        if (this.config('mode') === "command") {
            this.parsed = this._parser.command(this.argv, this._registry.getRoot('command'));
            return this.parsed;
        }
        else if (this.config('mode') === 'groups') {
            var resolved = this._parser.resolve(this.argv);
            if (resolved) {
            }
        }
    };
    Cli.prototype.dump = function (target) {
        util_1.inspect(target || this);
    };
    Cli.prototype.group = function (name, config) {
        if (config === void 0) { config = {}; }
        config.name = name;
        return this._registry.addGroup(config);
    };
    Cli.prototype.command = function (name, config) {
        config.name = name;
        return this._registry.addCommand(config);
    };
    Cli.prototype.option = function (name, config) {
        if (config === void 0) { config = {}; }
        var global = config.global = config.global || false, key = global && this.config('mode') === "group" ? 'globalOptions' : 'options';
        delete config.global;
        this._registry.getRoot(this.config('mode'))[key][name] = config;
        return this;
    };
    Cli.prototype.options = function (options) {
        var _this = this;
        if (util_1.kindOf(options) !== 'array') {
            Object.keys(options).forEach(function (name) { return _this.option(name, options[name]); });
        }
        return this;
    };
    Cli.prototype.argument = function (name, config) {
        if (config === void 0) { config = {}; }
        if (this.config('mode') !== 'command') {
            throw new Error('Cannot declare arguments for the CLI when using group mode. Use command mode instead');
        }
        this._registry.getRoot("command").arguments[name] = config;
        return this;
    };
    Cli.prototype.arguments = function (config) {
        var _this = this;
        if (util_1.kindOf(config) !== 'array') {
            Object.keys(config).forEach(function (name) { return _this.argument(name, config[name]); });
        }
        return this;
    };
    return Cli;
}());
Cli = __decorate([
    ioc_1.Container.singleton('console.cli'),
    __param(0, ioc_1.Container.inject('console.registry')),
    __param(1, ioc_1.Container.inject('console.parser')),
    __param(2, ioc_1.Container.inject('console.router')),
    __metadata("design:paramtypes", [registry_1.Registry, typeof (_a = typeof parser_1.Parser !== "undefined" && parser_1.Parser) === "function" && _a || Object, router_1.Router])
], Cli);
exports.Cli = Cli;
var _a;
//# sourceMappingURL=cli.js.map