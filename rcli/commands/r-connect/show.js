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
var RcliConnectSetCmd = (function () {
    function RcliConnectSetCmd() {
    }
    RcliConnectSetCmd.prototype.handle = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
    };
    return RcliConnectSetCmd;
}());
__decorate([
    src_1.inject('cli.helpers.output'),
    __metadata("design:type", src_1.Output)
], RcliConnectSetCmd.prototype, "out", void 0);
__decorate([
    src_1.inject('cli.log'),
    __metadata("design:type", Object)
], RcliConnectSetCmd.prototype, "log", void 0);
__decorate([
    src_1.inject('config'),
    __metadata("design:type", Function)
], RcliConnectSetCmd.prototype, "config", void 0);
RcliConnectSetCmd = __decorate([
    src_1.command('show', 'set a connections')
], RcliConnectSetCmd);
exports.default = RcliConnectSetCmd;
//# sourceMappingURL=show.js.map