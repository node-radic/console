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
var RcliConnectAddCmd = (function () {
    function RcliConnectAddCmd() {
    }
    RcliConnectAddCmd.prototype.handle = function (args) {
        var argv = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            argv[_i - 1] = arguments[_i];
        }
        this.out.dump({ args: args, argv: argv });
    };
    return RcliConnectAddCmd;
}());
__decorate([
    src_1.inject('cli.helpers.output'),
    __metadata("design:type", src_1.Output)
], RcliConnectAddCmd.prototype, "out", void 0);
__decorate([
    src_1.inject('cli.log'),
    __metadata("design:type", Object)
], RcliConnectAddCmd.prototype, "log", void 0);
__decorate([
    src_1.inject('config'),
    __metadata("design:type", Function)
], RcliConnectAddCmd.prototype, "config", void 0);
__decorate([
    src_1.option('p', 'server ssh port'),
    __metadata("design:type", String)
], RcliConnectAddCmd.prototype, "port", void 0);
__decorate([
    src_1.option('m', 'method of connecting (key|password)'),
    __metadata("design:type", String)
], RcliConnectAddCmd.prototype, "method", void 0);
__decorate([
    src_1.option('L', 'path to local mount point (sshfs)'),
    __metadata("design:type", String)
], RcliConnectAddCmd.prototype, "mountLocal", void 0);
__decorate([
    src_1.option('R', 'path on the remote server to mount (sshfs)'),
    __metadata("design:type", String)
], RcliConnectAddCmd.prototype, "mountRemote", void 0);
RcliConnectAddCmd = __decorate([
    src_1.command('add {name|key:the connection name} {user} {host}', 'add a connection')
], RcliConnectAddCmd);
exports.default = RcliConnectAddCmd;
//# sourceMappingURL=add.js.map