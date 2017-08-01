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
    RcliConnectCmd.prototype.handle = function (args, argv) {
        this.showHelp();
        this.out.line('alright');
    };
    __decorate([
        src_1.lazyInject('cli.helpers.output'),
        __metadata("design:type", src_1.OutputHelper)
    ], RcliConnectCmd.prototype, "out", void 0);
    __decorate([
        src_1.lazyInject('cli.log'),
        __metadata("design:type", Object)
    ], RcliConnectCmd.prototype, "log", void 0);
    __decorate([
        src_1.lazyInject('cli.config'),
        __metadata("design:type", Function)
    ], RcliConnectCmd.prototype, "config", void 0);
    RcliConnectCmd = __decorate([
        src_1.command('connect|con [command]', 'SSH connection helper', {
            isGroup: true,
            helpers: {
                help: {
                    app: { title: 'SSH Connection Helper' }
                }
            }
        })
    ], RcliConnectCmd);
    return RcliConnectCmd;
}());
exports.RcliConnectCmd = RcliConnectCmd;
exports.default = RcliConnectCmd;
//# sourceMappingURL=r-connect.js.map