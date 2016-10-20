"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var src_1 = require("../../src");
var InitCommand = (function (_super) {
    __extends(InitCommand, _super);
    function InitCommand() {
        _super.apply(this, arguments);
    }
    InitCommand.prototype.handle = function () {
        this.out.success('Success');
    };
    InitCommand = __decorate([
        src_1.command('init', 'Initialize R', 'Give the current working directory a bit of R.'), 
        __metadata('design:paramtypes', [])
    ], InitCommand);
    return InitCommand;
}(src_1.Command));
exports.InitCommand = InitCommand;
//# sourceMappingURL=init.js.map