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
var decorators_1 = require("../../src/decorators");
var RcliCmd = (function () {
    function RcliCmd() {
    }
    RcliCmd.prototype.always = function () {
        if (this.config('debug') === true) {
            this.log.level = 'debug';
            this.log.debug('Debug is enabled');
        }
    };
    RcliCmd.prototype.handle = function () {
    };
    __decorate([
        src_1.lazyInject('cli.log'),
        __metadata("design:type", Object)
    ], RcliCmd.prototype, "log", void 0);
    __decorate([
        src_1.lazyInject('cli.config'),
        __metadata("design:type", Function)
    ], RcliCmd.prototype, "config", void 0);
    __decorate([
        decorators_1.alwaysRun(),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], RcliCmd.prototype, "always", null);
    RcliCmd = __decorate([
        src_1.command('r {command:string@any of the listed commands}', {
            isGroup: true,
            // subCommands: [ 'connect' ],
            onMissingArgument: 'help'
        })
    ], RcliCmd);
    return RcliCmd;
}());
exports.RcliCmd = RcliCmd;
exports.default = RcliCmd;
//# sourceMappingURL=r.js.map