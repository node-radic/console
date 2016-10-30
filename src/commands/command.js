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
const BB = require("bluebird");
const core_1 = require("../core");
const factory_1 = require("./factory");
let Command = class Command extends factory_1.BaseCommandRegistration {
    constructor() {
        super();
        this.argv = [];
        this.arguments = {};
        this.options = {};
        this.defaultHelpers = ['interaction'];
    }
    parse() {
        this.parsed = core_1.kernel.get(core_1.BINDINGS.ARGUMENTS_DEFINITION)
            .mergeOptions(this.definition)
            .mergeArguments(this.definition)
            .mergeOptions(this.globalDefinition)
            .parse(this.argv);
        this.handleHelp();
        if (this.parsed.hasErrors()) {
            this.handleParseErrors();
        }
        this.handleDefaultHelpers();
    }
    handleHelp() {
        if (this.parsed.help.enabled && this.parsed.help.show) {
            this.showHelp();
            this.cli.exit();
        }
    }
    showHelp(title, desc) {
        this.out
            .title(title || this.prettyName)
            .description(desc || this.desc);
        this.descriptor.command(this);
    }
    handleParseErrors() {
        let len = this.parsed.errors.length;
        let text = len === 1 ? '1 error:' : len + ' errors:';
        this.out.subtitle('The command failed because of ' + text);
        this.parsed.errors.forEach((err, i) => {
            this.log.error(err);
        });
        this.fail();
        this.cli.exit();
    }
    handleDefaultHelpers() {
        this.defaultHelpers.forEach((name) => {
            let cls = require('./helpers/' + name).default;
            this.addHelper(cls);
        });
        this.defaultHelpers = [];
    }
    hasArg(n) { return this.parsed.hasArg(n); }
    askArg(name, opts = {}) {
        let defer = BB.defer();
        if (this.hasArg(name))
            defer.resolve(this.arg(name));
        else
            this.in.ask(name + '?', opts)
                .then((answer) => defer.resolve(answer));
        return defer.promise;
    }
    askArgs(questions) {
        return this.in.askArgs(this.parsed, questions);
    }
    arg(n) { return this.parsed.arg(n); }
    hasOpt(n) { return this.parsed.hasOpt(n); }
    opt(n) { return this.parsed.opt(n); }
    setArguments(args) { this.definition.arguments(args); }
    setOptions(options) { this.definition.options(options); }
    line(text) { this.out.writeln(text); }
    table(options) { }
    progress() { }
    title() { }
    addHelper(cls) {
        let helper = core_1.kernel.build(cls);
        helper.setCommand(this);
        this.log.debug('Adding helper ' + helper.getName(), helper);
        this.helpers.set(helper.getName(), helper);
        return this;
    }
    getHelper(name) { return this.helpers.get(name); }
};
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
exports.Command = Command;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Command;
//# sourceMappingURL=command.js.map