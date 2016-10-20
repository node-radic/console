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
var ConfigGroup = (function (_super) {
    __extends(ConfigGroup, _super);
    function ConfigGroup() {
        _super.apply(this, arguments);
    }
    ConfigGroup = __decorate([
        src_1.group('config', 'Configuration', 'Manage the global and local configuration'), 
        __metadata('design:paramtypes', [])
    ], ConfigGroup);
    return ConfigGroup;
}(src_1.Group));
exports.ConfigGroup = ConfigGroup;
var ListConfigCommand = (function (_super) {
    __extends(ListConfigCommand, _super);
    function ListConfigCommand() {
        _super.apply(this, arguments);
    }
    ListConfigCommand = __decorate([
        src_1.command('list', 'List Configuration', 'Give the current working directory a bit of R.', ConfigGroup), 
        __metadata('design:paramtypes', [])
    ], ListConfigCommand);
    return ListConfigCommand;
}(src_1.Command));
exports.ListConfigCommand = ListConfigCommand;
//# sourceMappingURL=config.js.map