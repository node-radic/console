"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var events_1 = require("events");
var fs_extra_1 = require("fs-extra");
var bindings_1 = require("./bindings");
var _1 = require("./");
var app_1 = require("./app");
_1.decorate(_1.injectable(), events_1.EventEmitter);
var Cli = (function (_super) {
    __extends(Cli, _super);
    function Cli() {
        _super.call(this);
    }
    Cli.prototype.parse = function (argv) {
        if (this.argv)
            return;
        this.emit('parse');
        if (fs_extra_1.existsSync(argv[0])) {
            this.nodePath = argv.shift();
            this.binPath = argv.shift();
        }
        this.argv = argv;
    };
    Cli.prototype.showHelp = function () {
        var without = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            without[_i - 0] = arguments[_i];
        }
        var descriptor = app_1.app.get(bindings_1.BINDINGS.DESCRIPTOR);
        descriptor.cli(this);
    };
    Cli.prototype.exit = function (fail) {
        if (fail === void 0) { fail = false; }
        process.exit(fail ? 1 : 0);
    };
    Cli.prototype.fail = function (msg) {
        if (msg)
            this.log.error(msg);
        this.exit(true);
    };
    Cli.prototype.profile = function (id, msg, meta, callback) {
        this.log.profile.apply(this.log, arguments);
    };
    __decorate([
        _1.inject(bindings_1.BINDINGS.CONFIG), 
        __metadata('design:type', Function)
    ], Cli.prototype, "config", void 0);
    __decorate([
        _1.inject(bindings_1.BINDINGS.LOG), 
        __metadata('design:type', Object)
    ], Cli.prototype, "log", void 0);
    __decorate([
        _1.inject(bindings_1.BINDINGS.ROOT_DEFINITION), 
        __metadata('design:type', Object)
    ], Cli.prototype, "definition", void 0);
    __decorate([
        _1.inject(bindings_1.BINDINGS.OUTPUT), 
        __metadata('design:type', Object)
    ], Cli.prototype, "out", void 0);
    __decorate([
        _1.inject(bindings_1.BINDINGS.ROOT_DEFINITION_PARSER_FACTORY), 
        __metadata('design:type', Function)
    ], Cli.prototype, "definitionParserFactory", void 0);
    __decorate([
        _1.inject(bindings_1.BINDINGS.DESCRIPTOR), 
        __metadata('design:type', Object)
    ], Cli.prototype, "_descriptor", void 0);
    Cli = __decorate([
        _1.injectable(), 
        __metadata('design:paramtypes', [])
    ], Cli);
    return Cli;
}(events_1.EventEmitter));
exports.Cli = Cli;
var ArgumentsCli = (function (_super) {
    __extends(ArgumentsCli, _super);
    function ArgumentsCli() {
        _super.apply(this, arguments);
    }
    ArgumentsCli.prototype.parse = function (argv) {
        _super.prototype.parse.call(this, argv);
        var definitionParser = this.definitionParserFactory(this.definition, this.argv);
        this.parsed = definitionParser.parse();
        if (this.definition.isHelpEnabled() && this.parsed.opt(this.definition.helpKey) === true) {
            this.showHelp();
            this.exit();
        }
    };
    return ArgumentsCli;
}(Cli));
exports.ArgumentsCli = ArgumentsCli;
var CommandsCli = (function (_super) {
    __extends(CommandsCli, _super);
    function CommandsCli() {
        _super.apply(this, arguments);
    }
    CommandsCli.prototype.parse = function (argv) {
        _super.prototype.parse.call(this, argv);
        var parser = this.definitionParserFactory(this.definition, this.argv);
        this.parsed = parser.parse();
        var gparser = this.globalDefinitionParserFactory(this.globalDefinition, this.argv);
        this.parsed.global = gparser.parse();
        if (this.definition.isHelpEnabled() && this.parsed.opt(this.definition.helpKey) === true) {
            this.showHelp();
            this.exit();
        }
    };
    CommandsCli.prototype.getGlobalDefinition = function () {
        return this.globalDefinition;
    };
    __decorate([
        _1.inject(bindings_1.BINDINGS.GLOBAL_DEFINITION), 
        __metadata('design:type', Object)
    ], CommandsCli.prototype, "globalDefinition", void 0);
    __decorate([
        _1.inject(bindings_1.BINDINGS.OPTIONS_DEFINITION_PARSER_FACTORY), 
        __metadata('design:type', Function)
    ], CommandsCli.prototype, "globalDefinitionParserFactory", void 0);
    return CommandsCli;
}(Cli));
exports.CommandsCli = CommandsCli;
//# sourceMappingURL=cli.js.map