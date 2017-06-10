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
src_1.cli.globals({
    v: {
        count: true,
        name: 'verbose',
        description: 'Extra verbose output'
    }
});
var RCliCmd = (function () {
    function RCliCmd() {
        this.force = false;
    }
    RCliCmd.prototype.handle = function () {
        console.log("THIS IS" + (this.force ? '' : ' NOT') + " FORCED");
    };
    return RCliCmd;
}());
__decorate([
    src_1.option('f', 'forces execution, even when its shouldnt'),
    __metadata("design:type", Boolean)
], RCliCmd.prototype, "force", void 0);
RCliCmd = __decorate([
    src_1.command({
        subCommands: ['con']
    })
], RCliCmd);
exports.RCliCmd = RCliCmd;
//# sourceMappingURL=rcli.js.map