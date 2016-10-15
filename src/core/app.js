"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var inversify_1 = require("inversify");
var inversify_binding_decorators_1 = require("inversify-binding-decorators");
var inversify_inject_decorators_1 = require("inversify-inject-decorators");
var bindings_1 = require("./bindings");
var cli_1 = require("./cli");
var log_1 = require("./log");
var config_1 = require("./config");
var io_1 = require("../io");
var definitions_1 = require("../definitions");
var commands_1 = require("../commands");
var App = (function (_super) {
    __extends(App, _super);
    function App() {
        _super.apply(this, arguments);
    }
    App.prototype.build = function (cls) {
        this.ensureInjectable(cls);
        var k = 'temporary.kernel.binding';
        this.bind(k).to(cls);
        var instance = this.get(k);
        this.unbind(k);
        return instance;
    };
    App.prototype.make = function (cls) {
        this.ensureInjectable(cls);
        var binding = cls.toString();
        if (this.isBound(binding)) {
            return this.get(binding);
        }
        this.bind(binding).to(cls);
        return this.get(binding);
    };
    App.prototype.ensureInjectable = function (cls) {
        try {
            inversify_1.decorate(inversify_1.injectable(), cls);
        }
        catch (err) { }
    };
    App.prototype.Cli = function (cls, def, defparser) {
        this.bindKernel(this);
        this.bind(bindings_1.default.ROOT_DEFINITION).to(def).inSingletonScope();
        this.bindParserFactory(bindings_1.default.ROOT_DEFINITION_PARSER_FACTORY, defparser);
        this.bind(bindings_1.default.CLI).to(cls).inSingletonScope();
        return this.get(bindings_1.default.CLI);
    };
    App.prototype.commandsCli = function () {
        return this.Cli(cli_1.CommandsCli, definitions_1.CommandsDefinition, bindings_1.default.COMMANDS_DEFINITION_PARSER);
    };
    App.prototype.argumentsCli = function () {
        if (this.isBound(bindings_1.default.CLI))
            throw Error('cli already created');
        this.bindKernel(this);
        this.bind(bindings_1.default.ROOT_DEFINITION).to(definitions_1.ArgumentsDefinition).inSingletonScope();
        this.bindParserFactory(bindings_1.default.ROOT_DEFINITION_PARSER_FACTORY, bindings_1.default.ARGUMENTS_DEFINITION_PARSER);
        this.bind(bindings_1.default.CLI).to(cli_1.ArgumentsCli).inSingletonScope();
        return this.get(bindings_1.default.CLI);
    };
    App.prototype.bindKernel = function (kernel) {
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
        this.bindParserFactory(bindings_1.default.OPTIONS_DEFINITION_PARSER_FACTORY, bindings_1.default.OPTIONS_DEFINITION_PARSER);
        this.bindParserFactory(bindings_1.default.ARGUMENTS_DEFINITION_PARSER_FACTORY, bindings_1.default.ARGUMENTS_DEFINITION_PARSER);
        this.bindParserFactory(bindings_1.default.COMMANDS_DEFINITION_PARSER_FACTORY, bindings_1.default.COMMANDS_DEFINITION_PARSER);
    };
    App.prototype.bindParserFactory = function (binding, parserBinding) {
        this.bind(binding).toFactory(function (context) {
            return function (definition, argv) {
                var parser = context.kernel.get(parserBinding);
                parser.definition = definition;
                parser.argv = argv;
                return parser;
            };
        });
    };
    return App;
}(inversify_1.Kernel));
exports.App = App;
exports.app = new App;
var lazyInject = inversify_inject_decorators_1.default(exports.app).lazyInject;
exports.lazyInject = lazyInject;
var provide = inversify_binding_decorators_1.makeProvideDecorator(exports.app);
exports.provide = provide;
var provideSingleton = function (identifier) {
    return provide(identifier)['inSingletonScope']()
        .done();
};
exports.provideSingleton = provideSingleton;
//# sourceMappingURL=app.js.map