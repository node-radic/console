"use strict";
const inversify_1 = require("inversify");
exports.inject = inversify_1.inject;
exports.decorate = inversify_1.decorate;
exports.injectable = inversify_1.injectable;
const inversify_binding_decorators_1 = require("inversify-binding-decorators");
const inversify_inject_decorators_1 = require("inversify-inject-decorators");
const bindings_1 = require("./bindings");
const cli_1 = require("./cli");
const log_1 = require("./log");
const config_1 = require("./config");
const io_1 = require("../io");
const definitions_1 = require("../definitions");
const commands_1 = require("../commands");
const helpers_1 = require("./helpers");
class ConsoleKernel extends inversify_1.Kernel {
    build(cls) {
        this.ensureInjectable(cls);
        let k = 'temporary.kernel.binding';
        this.bind(k).to(cls);
        let instance = this.get(k);
        this.unbind(k);
        return instance;
    }
    make(cls) {
        this.ensureInjectable(cls);
        let binding = cls.toString();
        if (this.isBound(binding)) {
            return this.get(binding);
        }
        this.bind(binding).to(cls);
        return this.get(binding);
    }
    ensureInjectable(cls) {
        try {
            inversify_1.decorate(inversify_1.injectable(), cls);
        }
        catch (err) { }
    }
    Cli(cls, def) {
        this.bindKernel(this);
        this.bind(bindings_1.default.ROOT_DEFINITION).to(def).inSingletonScope();
        this.bind(bindings_1.default.CLI).to(cls).inSingletonScope();
        return this.get(bindings_1.default.CLI);
    }
    commandsCli() {
        return this.Cli(cli_1.CommandsCli, definitions_1.CommandsDefinition);
    }
    argumentsCli() {
        return this.Cli(cli_1.ArgumentsCli, definitions_1.CommandsDefinition);
    }
    bindKernel(kernel) {
        kernel.bind(bindings_1.default.GLOBAL_DEFINITION).to(definitions_1.OptionsDefinition).inSingletonScope();
        kernel.bind(bindings_1.default.LOG).to(log_1.Log).inSingletonScope();
        kernel.bind(bindings_1.default.DESCRIPTOR).to(io_1.Descriptor).inSingletonScope();
        kernel.bind(bindings_1.default.CONFIG).toConstantValue(config_1.config);
        kernel.bind(bindings_1.default.COMMANDS_FACTORY).to(commands_1.CommandFactory).inSingletonScope();
        kernel.bind(bindings_1.default.INPUT).to(io_1.Input);
        kernel.bind(bindings_1.default.OUTPUT).to(io_1.Output);
        kernel.bind(bindings_1.default.HELPERS).to(helpers_1.Helpers);
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
    }
}
exports.ConsoleKernel = ConsoleKernel;
let kernel = new ConsoleKernel;
exports.kernel = kernel;
let { lazyInject } = inversify_inject_decorators_1.default(kernel);
exports.lazyInject = lazyInject;
let provide = inversify_binding_decorators_1.makeProvideDecorator(kernel);
exports.provide = provide;
let fprovide = inversify_binding_decorators_1.makeFluentProvideDecorator(kernel);
let provideSingleton = function (identifier) {
    return fprovide(identifier).inSingletonScope().done();
};
exports.provideSingleton = provideSingleton;
//# sourceMappingURL=kernel.js.map