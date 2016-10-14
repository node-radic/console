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
var Promise = require("bluebird");
var inversify_1 = require("inversify");
var core_1 = require("../core");
var cli_1 = require("../core/cli");
var Command = (function () {
    function Command() {
        this.argv = [];
        this.arguments = {};
        this.options = {};
        this.asyncMode = false;
    }
    Command.prototype.fire = function () {
        this.defer = Promise.defer();
        this.parse();
        this['handle'].apply(this);
        if (false === this.asyncMode) {
            this.done();
        }
        return this.defer.promise;
    };
    Command.prototype.parse = function () {
        this.parsed = this.definitionParserFactory(this.definition, this.argv).parse();
    };
    Command.prototype.async = function () {
        this.asyncMode = true;
        return this.done;
    };
    Command.prototype.done = function () { this.defer.resolve(this); };
    Command.prototype.fail = function (reason) { this.defer.reject(reason); };
    Command.prototype.hasArg = function (n) { return this.parsed.hasArg(n); };
    Command.prototype.arg = function (n) { return this.parsed.arg(n); };
    Command.prototype.hasOpt = function (n) { return this.parsed.hasOpt(n); };
    Command.prototype.opt = function (n) { return this.parsed.opt(n); };
    Command.prototype.showHelp = function () { this.definition.showHelp(); };
    Command.prototype.setArguments = function (args) { this.definition.arguments(args); };
    Command.prototype.setOptions = function (options) { this.definition.options(options); };
    Command.prototype.line = function (text) { this.out.writeln(text); };
    Command.prototype.table = function (options) { };
    Command.prototype.progress = function () { };
    Command.prototype.title = function () { };
    Command.prototype.addHelper = function (name, helper) { this.helpers[name] = helper; };
    Command.prototype.getHelper = function (name) { return this.helpers[name]; };
    __decorate([
        inversify_1.inject(core_1.BINDINGS.ARGUMENTS_DEFINITION), 
        __metadata('design:type', Object)
    ], Command.prototype, "definition", void 0);
    __decorate([
        inversify_1.inject(core_1.BINDINGS.INPUT), 
        __metadata('design:type', Object)
    ], Command.prototype, "input", void 0);
    __decorate([
        inversify_1.inject(core_1.BINDINGS.OUTPUT), 
        __metadata('design:type', Object)
    ], Command.prototype, "out", void 0);
    __decorate([
        inversify_1.inject(core_1.BINDINGS.LOG), 
        __metadata('design:type', Object)
    ], Command.prototype, "log", void 0);
    __decorate([
        inversify_1.inject(core_1.BINDINGS.CLI), 
        __metadata('design:type', cli_1.Cli)
    ], Command.prototype, "cli", void 0);
    __decorate([
        inversify_1.inject(core_1.BINDINGS.OPTIONS_DEFINITION_PARSER_FACTORY), 
        __metadata('design:type', Function)
    ], Command.prototype, "definitionParserFactory", void 0);
    Command = __decorate([
        inversify_1.injectable(), 
        __metadata('design:paramtypes', [])
    ], Command);
    return Command;
}());
exports.Command = Command;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Command;
//# sourceMappingURL=command.js.map