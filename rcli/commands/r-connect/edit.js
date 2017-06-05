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
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../../../src");
var RcliConnectEditCmd = (function () {
    function RcliConnectEditCmd() {
    }
    RcliConnectEditCmd.prototype.handle = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length !== 1) {
            this.log.error('Expected 1 argument');
        }
    };
    return RcliConnectEditCmd;
}());
__decorate([
    src_1.inject('cli.helpers.output'),
    __metadata("design:type", src_1.Output)
], RcliConnectEditCmd.prototype, "out", void 0);
__decorate([
    src_1.inject('cli.log'),
    __metadata("design:type", Object)
], RcliConnectEditCmd.prototype, "log", void 0);
__decorate([
    src_1.inject('config'),
    __metadata("design:type", Function)
], RcliConnectEditCmd.prototype, "config", void 0);
__decorate([
    src_1.option('H', 'server ip or hostname'),
    __metadata("design:type", String)
], RcliConnectEditCmd.prototype, "host", void 0);
__decorate([
    src_1.option('p', 'server ssh port'),
    __metadata("design:type", String)
], RcliConnectEditCmd.prototype, "port", void 0);
__decorate([
    src_1.option('u', 'username for login'),
    __metadata("design:type", String)
], RcliConnectEditCmd.prototype, "user", void 0);
__decorate([
    src_1.option('m', 'method of connecting (key|password)'),
    __metadata("design:type", String)
], RcliConnectEditCmd.prototype, "method", void 0);
__decorate([
    src_1.option('L', 'path to local mount point (sshfs)'),
    __metadata("design:type", String)
], RcliConnectEditCmd.prototype, "mountLocal", void 0);
__decorate([
    src_1.option('R', 'path on the remote server to mount (sshfs)'),
    __metadata("design:type", String)
], RcliConnectEditCmd.prototype, "mountRemote", void 0);
RcliConnectEditCmd = __decorate([
    src_1.command('edit', 'edit a connections', {
        usage: 'edit <name> [options]'
    })
], RcliConnectEditCmd);
exports.default = RcliConnectEditCmd;
//# sourceMappingURL=edit.js.map