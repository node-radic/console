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
var eventemitter2_1 = require("eventemitter2");
var fs_extra_1 = require("fs-extra");
var _1 = require("./");
_1.decorate(_1.injectable(), eventemitter2_1.EventEmitter2);
var Cli = (function (_super) {
    __extends(Cli, _super);
    function Cli() {
        _super.call(this);
    }
    Cli.prototype.handle = function () {
        this.handleHelp();
        this.handleHandlerOptions();
    };
    Cli.prototype.handleHelp = function () {
        if (this.parsed.help.show) {
            this.showHelp();
            return this.exit();
        }
    };
    Cli.prototype.handleHandlerOptions = function () {
        var _this = this;
        Object.keys(this.definition.getJoinedOptions())
            .filter(this.parsed.hasOpt.bind(this.parsed))
            .forEach(function (name) {
            var handler = _this.definition.getOptions().handler[name];
            if (handler && handler.call(_this) === false) {
                _this.exit();
            }
        });
    };
    Cli.prototype.parse = function (argv) {
        if (this.argv)
            return;
        this.emit('parse');
        if (fs_extra_1.existsSync(argv[0])) {
            this.nodePath = argv.shift();
            this.binPath = argv.shift();
        }
        this.argv = argv;
        var parser = this.definitionParserFactory(this.definition, this.argv);
        this.parsed = parser.parse();
    };
    Cli.prototype.showHelp = function () {
        var without = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            without[_i - 0] = arguments[_i];
        }
        var descriptor = _1.kernel.get(_1.BINDINGS.DESCRIPTOR);
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
        _1.inject(_1.BINDINGS.CONFIG), 
        __metadata('design:type', Function)
    ], Cli.prototype, "config", void 0);
    __decorate([
        _1.inject(_1.BINDINGS.LOG), 
        __metadata('design:type', Object)
    ], Cli.prototype, "log", void 0);
    __decorate([
        _1.inject(_1.BINDINGS.ROOT_DEFINITION), 
        __metadata('design:type', Object)
    ], Cli.prototype, "definition", void 0);
    __decorate([
        _1.inject(_1.BINDINGS.OUTPUT), 
        __metadata('design:type', Object)
    ], Cli.prototype, "out", void 0);
    __decorate([
        _1.inject(_1.BINDINGS.INPUT), 
        __metadata('design:type', Object)
    ], Cli.prototype, "in", void 0);
    __decorate([
        _1.inject(_1.BINDINGS.ROOT_DEFINITION_PARSER_FACTORY), 
        __metadata('design:type', Function)
    ], Cli.prototype, "definitionParserFactory", void 0);
    __decorate([
        _1.inject(_1.BINDINGS.DESCRIPTOR), 
        __metadata('design:type', Object)
    ], Cli.prototype, "descriptor", void 0);
    Cli = __decorate([
        _1.injectable(), 
        __metadata('design:paramtypes', [])
    ], Cli);
    return Cli;
}(eventemitter2_1.EventEmitter2));
exports.Cli = Cli;
var ArgumentsCli = (function (_super) {
    __extends(ArgumentsCli, _super);
    function ArgumentsCli() {
        _super.apply(this, arguments);
    }
    ArgumentsCli.prototype.parse = function (argv) {
        _super.prototype.parse.call(this, argv);
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
    };
    CommandsCli.prototype.handle = function () {
        var _this = this;
        _super.prototype.handle.call(this);
        if (this.parsed.isCommand) {
            return this.parsed.command.fire().then(function () {
                _this.exit();
            });
        }
        if (this.parsed.isGroup) {
            return this.parsed.group.fire().then(function () {
                _this.exit();
            });
        }
        this.fail('No options or arguments provided.  Use the -h or --help option to show what can be done');
    };
    __decorate([
        _1.inject(_1.BINDINGS.GLOBAL_DEFINITION), 
        __metadata('design:type', Object)
    ], CommandsCli.prototype, "globalDefinition", void 0);
    return CommandsCli;
}(Cli));
exports.CommandsCli = CommandsCli;
//# sourceMappingURL=cli.js.map