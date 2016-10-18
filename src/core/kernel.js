"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var inversify_1 = require("inversify");
exports.inject = inversify_1.inject;
exports.decorate = inversify_1.decorate;
exports.injectable = inversify_1.injectable;
var inversify_binding_decorators_1 = require("inversify-binding-decorators");
var inversify_inject_decorators_1 = require("inversify-inject-decorators");
var bindings_1 = require("./bindings");
var cli_1 = require("./cli");
var log_1 = require("./log");
var config_1 = require("./config");
var io_1 = require("../io");
var definitions_1 = require("../definitions");
var commands_1 = require("../commands");
var ConsoleKernel = (function (_super) {
    __extends(ConsoleKernel, _super);
    function ConsoleKernel() {
        _super.apply(this, arguments);
    }
    ConsoleKernel.prototype.build = function (cls) {
        this.ensureInjectable(cls);
        var k = 'temporary.kernel.binding';
        this.bind(k).to(cls);
        var instance = this.get(k);
        this.unbind(k);
        return instance;
    };
    ConsoleKernel.prototype.make = function (cls) {
        this.ensureInjectable(cls);
        var binding = cls.toString();
        if (this.isBound(binding)) {
            return this.get(binding);
        }
        this.bind(binding).to(cls);
        return this.get(binding);
    };
    ConsoleKernel.prototype.ensureInjectable = function (cls) {
        try {
            inversify_1.decorate(inversify_1.injectable(), cls);
        }
        catch (err) { }
    };
    ConsoleKernel.prototype.Cli = function (cls, def) {
        this.bindKernel(this);
        this.bind(bindings_1.default.ROOT_DEFINITION).to(def).inSingletonScope();
        this.bind(bindings_1.default.CLI).to(cls).inSingletonScope();
        return this.get(bindings_1.default.CLI);
    };
    ConsoleKernel.prototype.commandsCli = function () {
        return this.Cli(cli_1.CommandsCli, definitions_1.CommandsDefinition);
    };
    ConsoleKernel.prototype.argumentsCli = function () {
        return this.Cli(cli_1.ArgumentsCli, definitions_1.CommandsDefinition);
    };
    ConsoleKernel.prototype.bindKernel = function (kernel) {
        kernel.bind(bindings_1.default.GLOBAL_DEFINITION).to(definitions_1.OptionsDefinition).inSingletonScope();
        kernel.bind(bindings_1.default.LOG).to(log_1.Log).inSingletonScope();
        kernel.bind(bindings_1.default.DESCRIPTOR).to(io_1.Descriptor).inSingletonScope();
        kernel.bind(bindings_1.default.CONFIG).toConstantValue(config_1.config);
        kernel.bind(bindings_1.default.COMMANDS_FACTORY).to(commands_1.CommandFactory).inSingletonScope();
        kernel.bind(bindings_1.default.INPUT).to(io_1.Input);
        kernel.bind(bindings_1.default.OUTPUT).to(io_1.Output);
        kernel.bind(bindings_1.default.OPTIONS_DEFINITION).to(definitions_1.OptionsDefinition);
        kernel.bind(bindings_1.default.ARGUMENTS_DEFINITION).to(definitions_1.ArgumentsDefinition);
        kernel.bind(bindings_1.default.COMMANDS_DEFINITION).to(definitions_1.CommandsDefinition);
        kernel.bind(bindings_1.default.OPTIONS_DEFINITION_PARSER).to(definitions_1.OptionsDefinitionParser);
        kernel.bind(bindings_1.default.ARGUMENTS_DEFINITION_PARSER).to(definitions_1.ArgumentsDefinitionParser);
        kernel.bind(bindings_1.default.COMMANDS_DEFINITION_PARSER).to(definitions_1.CommandsDefinitionParser);
        kernel.bind(bindings_1.default.PARSED_OPTIONS_DEFINITION).to(definitions_1.ParsedOptionsDefinition);
        kernel.bind(bindings_1.default.PARSED_ARGUMENTS_DEFINITION).to(definitions_1.ParsedArgumentsDefinition);
        kernel.bind(bindings_1.default.PARSED_COMMANDS_DEFINITION).to(definitions_1.ParsedCommandsDefinition);
        kernel.bind(bindings_1.default.DEFINITION_SIGNATURE_PARSER).to(definitions_1.DefinitionSignatureParser);
    };
    return ConsoleKernel;
}(inversify_1.Kernel));
exports.ConsoleKernel = ConsoleKernel;
var kernel = new ConsoleKernel;
exports.kernel = kernel;
var lazyInject = inversify_inject_decorators_1.default(kernel).lazyInject;
exports.lazyInject = lazyInject;
var provide = inversify_binding_decorators_1.makeProvideDecorator(kernel);
exports.provide = provide;
var fprovide = inversify_binding_decorators_1.makeFluentProvideDecorator(kernel);
var provideSingleton = function (identifier) {
    return fprovide(identifier).inSingletonScope().done();
};
exports.provideSingleton = provideSingleton;
//# sourceMappingURL=kernel.js.map