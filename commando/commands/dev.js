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
var core_1 = require('../core');
var connection_1 = require("../services/connection");
var DevGroup = (function (_super) {
    __extends(DevGroup, _super);
    function DevGroup() {
        _super.apply(this, arguments);
    }
    DevGroup.prototype.handle = function () {
        if (core_1.config('debug') !== true) {
            this.fail('Requires debug mode');
        }
    };
    DevGroup = __decorate([
        src_1.group('dev', 'Dev/Debug Commands', 'Extra commands for debugging and development purposes'), 
        __metadata('design:paramtypes', [])
    ], DevGroup);
    return DevGroup;
}(src_1.Group));
exports.DevGroup = DevGroup;
var DevCommand = (function (_super) {
    __extends(DevCommand, _super);
    function DevCommand() {
        _super.apply(this, arguments);
    }
    DevCommand.prototype.handle = function () {
        if (core_1.config('debug') !== true) {
            this.fail('Requires debug mode');
        }
    };
    DevCommand = __decorate([
        src_1.injectable(), 
        __metadata('design:paramtypes', [])
    ], DevCommand);
    return DevCommand;
}(src_1.Command));
exports.DevCommand = DevCommand;
var ConDevCommand = (function (_super) {
    __extends(ConDevCommand, _super);
    function ConDevCommand() {
        _super.apply(this, arguments);
    }
    ConDevCommand.prototype.handle = function () {
    };
    __decorate([
        src_1.inject(core_1.COMMANDO.CONNECTIONS), 
        __metadata('design:type', connection_1.ConnectionRepository)
    ], ConDevCommand.prototype, "connections", void 0);
    ConDevCommand = __decorate([
        src_1.command('con', 'Connections Seeder', 'Add working connections for testing for all remotes.', DevGroup), 
        __metadata('design:paramtypes', [])
    ], ConDevCommand);
    return ConDevCommand;
}(src_1.Command));
exports.ConDevCommand = ConDevCommand;
//# sourceMappingURL=dev.js.map