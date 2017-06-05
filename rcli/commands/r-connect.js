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
var src_1 = require("../../src");
var RcliConnectCmd = (function () {
    function RcliConnectCmd() {
    }
    return RcliConnectCmd;
}());
__decorate([
    src_1.inject('cli.helpers.output'),
    __metadata("design:type", src_1.Output)
], RcliConnectCmd.prototype, "out", void 0);
__decorate([
    src_1.inject('cli.log'),
    __metadata("design:type", Object)
], RcliConnectCmd.prototype, "log", void 0);
__decorate([
    src_1.inject('config'),
    __metadata("design:type", Function)
], RcliConnectCmd.prototype, "config", void 0);
RcliConnectCmd = __decorate([
    src_1.command('connect', 'SSH connection helper', {
        subCommands: ['add', 'edit', 'list', 'show'],
        usage: 'connect <command>',
        example: "$ connect list\n$ connect show <name> [options]\n$ connect add <name> [options]\n$ connect edit <name> [options]\n$ connect remove <name>"
    })
], RcliConnectCmd);
exports.default = RcliConnectCmd;
//# sourceMappingURL=r-connect.js.map