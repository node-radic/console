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
const eventemitter2_1 = require("eventemitter2");
const fs_extra_1 = require("fs-extra");
const _1 = require("./");
_1.decorate(_1.injectable(), eventemitter2_1.EventEmitter2);
let Cli = class Cli extends eventemitter2_1.EventEmitter2 {
    constructor() {
        super();
    }
    handle() {
        this.handleHelp();
        this.handleHandlerOptions();
    }
    handleHelp() {
        if (this.parsed.help.show) {
            this.showHelp();
            return this.exit();
        }
    }
    handleHandlerOptions() {
        Object.keys(this.definition.getJoinedOptions())
            .filter(this.parsed.hasOpt.bind(this.parsed))
            .forEach((name) => {
            let handler = this.definition.getOptions().handler[name];
            if (handler && handler.call(this) === false) {
                this.exit();
            }
        });
    }
    parse(argv) {
        if (this.argv)
            return;
        this.emit('parse');
        if (fs_extra_1.existsSync(argv[0])) {
            this.nodePath = argv.shift();
            this.binPath = argv.shift();
        }
        this.argv = argv;
        this.parsed = this.definition.parse(this.argv);
    }
    showHelp(...without) {
        let descriptor = _1.kernel.get(_1.BINDINGS.DESCRIPTOR);
        descriptor.cli(this);
    }
    exit(fail = false) {
        process.exit(fail ? 1 : 0);
    }
    fail(msg) {
        if (msg)
            this.log.error(msg);
        this.exit(true);
    }
    profile(id, msg, meta, callback) {
        this.log.profile.apply(this.log, arguments);
    }
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
    _1.inject(_1.BINDINGS.HELPERS), 
    __metadata('design:type', Object)
], Cli.prototype, "helpers", void 0);
__decorate([
    _1.inject(_1.BINDINGS.DESCRIPTOR), 
    __metadata('design:type', Object)
], Cli.prototype, "descriptor", void 0);
Cli = __decorate([
    _1.injectable(), 
    __metadata('design:paramtypes', [])
], Cli);
exports.Cli = Cli;
class ArgumentsCli extends Cli {
    parse(argv) {
        super.parse(argv);
    }
}
exports.ArgumentsCli = ArgumentsCli;
class CommandsCli extends Cli {
    constructor() {
        super();
    }
    parse(argv) {
        super.parse(argv);
        this.parsed.global = this.globalDefinition.parse(this.argv);
    }
    handleHelp() {
        super.handleHelp();
        if (this.parsed.global.help.enabled && this.parsed.isRoot && this.config('descriptor.cli.showHelpAsDefault')) {
            this.showHelp();
            return this.exit();
        }
    }
    handle() {
        super.handle();
        if (this.parsed.isCommand) {
            return this.parsed.command.fire();
        }
        if (this.parsed.isGroup) {
            return this.parsed.group.fire();
        }
        this.fail('No options or arguments provided.  Use the -h or --help option to show what can be done');
    }
}
__decorate([
    _1.inject(_1.BINDINGS.GLOBAL_DEFINITION), 
    __metadata('design:type', Object)
], CommandsCli.prototype, "globalDefinition", void 0);
exports.CommandsCli = CommandsCli;
//# sourceMappingURL=cli.js.map