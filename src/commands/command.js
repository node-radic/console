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
var inquirer = require("inquirer");
var _ = require("lodash");
var BB = require("bluebird");
var core_1 = require("../core");
var factory_1 = require("./factory");
var Command = (function (_super) {
    __extends(Command, _super);
    function Command() {
        _super.call(this);
        this.argv = [];
        this.arguments = {};
        this.options = {};
    }
    Command.prototype.parse = function () {
        this.parsed = this.definition.mergeOptions(this.globalDefinition).parse(this.argv);
        this.log.warn('ok');
        if (this.parsed.hasErrors()) {
            this.handleParseErrors();
        }
        this.handleHelp();
    };
    Command.prototype.handleHelp = function () {
        if (this.parsed.help.enabled && this.parsed.help.show) {
            this.showHelp();
            this.cli.exit();
        }
    };
    Command.prototype.handleParseErrors = function () {
        var _this = this;
        var len = this.parsed.errors.length;
        var text = len === 1 ? '1 error:' : len + ' errors:';
        this.out.subtitle('The command failed because of ' + text);
        this.parsed.errors.forEach(function (err, i) {
            _this.log.error(err);
        });
        this.fail();
        this.cli.exit();
    };
    Command.prototype.checkHelp = function (help) {
    };
    Command.prototype.hasArg = function (n) { return this.parsed.hasArg(n); };
    Command.prototype.askArg = function (name, opts) {
        if (opts === void 0) { opts = {}; }
        var defer = BB.defer();
        if (this.hasArg(name))
            defer.resolve(this.arg(name));
        else
            this.in.ask(name + '?', opts)
                .then(function (answer) { return defer.resolve(answer); });
        return defer.promise;
    };
    Command.prototype.askArgs = function (questions, argv) {
        var defer = BB.defer();
        var names = Object.keys(questions);
        if (argv.noInteraction) {
            defer.resolve(_.pick(argv, names));
            return defer.promise;
        }
        var pm = function (name, opts) { return _.merge({
            name: name,
            when: function (answers) { return !argv[name]; }
        }, opts); };
        var prompts = names.map(function (name) {
            return pm(name, questions[name]);
        });
        return inquirer.prompt(prompts).then(function (args) {
            args = _.chain(argv)
                .pick(names)
                .merge(args)
                .value();
            defer.resolve(args);
            return defer.promise;
        });
    };
    Command.prototype.arg = function (n) { return this.parsed.arg(n); };
    Command.prototype.hasOpt = function (n) { return this.parsed.hasOpt(n); };
    Command.prototype.opt = function (n) { return this.parsed.opt(n); };
    Command.prototype.showHelp = function (title, desc) {
        this.out
            .title(title || this.name)
            .line()
            .line(desc || this.desc);
        this.descriptor.command(this);
    };
    Command.prototype.setArguments = function (args) { this.definition.arguments(args); };
    Command.prototype.setOptions = function (options) { this.definition.options(options); };
    Command.prototype.line = function (text) { this.out.writeln(text); };
    Command.prototype.table = function (options) { };
    Command.prototype.progress = function () { };
    Command.prototype.title = function () { };
    Command.prototype.addHelper = function (name, helper) { this.helpers[name] = helper; };
    Command.prototype.getHelper = function (name) { return this.helpers[name]; };
    __decorate([
        core_1.inject(core_1.BINDINGS.ARGUMENTS_DEFINITION), 
        __metadata('design:type', Object)
    ], Command.prototype, "definition", void 0);
    __decorate([
        core_1.inject(core_1.BINDINGS.GLOBAL_DEFINITION), 
        __metadata('design:type', Object)
    ], Command.prototype, "globalDefinition", void 0);
    __decorate([
        core_1.inject(core_1.BINDINGS.HELPERS), 
        __metadata('design:type', Object)
    ], Command.prototype, "helpers", void 0);
    Command = __decorate([
        core_1.injectable(), 
        __metadata('design:paramtypes', [])
    ], Command);
    return Command;
}(factory_1.BaseCommandRegistration));
exports.Command = Command;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Command;
//# sourceMappingURL=command.js.map