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
        this.port = 22;
    }
    RcliConnectAddCmd.prototype.handle = function (args) {
        var argv = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            argv[_i - 1] = arguments[_i];
        }
        var add = {
            name: args.name,
            user: args.user,
            host: args.host,
            method: 'key',
            port: this.port,
            localPath: '/mnt/' + args.name,
            hostPath: '/'
        };
    };
    return RcliConnectAddCmd;
}());
__decorate([
    src_1.lazyInject('cli.helpers.output'),
    __metadata("design:type", src_1.Output)
], RcliConnectAddCmd.prototype, "out", void 0);
__decorate([
    src_1.lazyInject('cli.helpers.input'),
    __metadata("design:type", src_1.Input)
], RcliConnectAddCmd.prototype, "ask", void 0);
__decorate([
    src_1.lazyInject('cli.log'),
    __metadata("design:type", Object)
], RcliConnectAddCmd.prototype, "log", void 0);
__decorate([
    src_1.option('P', 'login using a password'),
    __metadata("design:type", String)
], RcliConnectAddCmd.prototype, "pass", void 0);
__decorate([
    src_1.option('p', 'use the given port (default: 22)'),
    __metadata("design:type", Number)
], RcliConnectAddCmd.prototype, "port", void 0);
__decorate([
    src_1.option('l', 'local mount path for sshfs (default: /mnt/<name>)'),
    __metadata("design:type", String)
], RcliConnectAddCmd.prototype, "localPath", void 0);
__decorate([
    src_1.option('h', 'host path to mount for sshfs (default: / )'),
    __metadata("design:type", String)
], RcliConnectAddCmd.prototype, "hostPath", void 0);
RcliConnectAddCmd = __decorate([
    src_1.command("add \n{name:string@the connection name} \n{host:string@the host to connect}\n[user/users:string[]@the user to login] \n[method:string[]@the connect method]", 'Add a connection')
], RcliConnectAddCmd);
exports.RcliConnectAddCmd = RcliConnectAddCmd;
exports.default = RcliConnectAddCmd;
//# sourceMappingURL=add.js.map