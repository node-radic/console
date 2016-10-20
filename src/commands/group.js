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
var core_1 = require("../core");
var factory_1 = require("./factory");
var Group = (function (_super) {
    __extends(Group, _super);
    function Group() {
        _super.apply(this, arguments);
    }
    Group.prototype.handle = function () {
        this.showHelp();
    };
    Group.prototype.showHelp = function (title, desc) {
        this.out
            .title(title || this.prettyName)
            .description(desc || this.desc)
            .line()
            .header(this.config('descriptor.text.commands'));
        this.descriptor.group(this);
        this.out.line();
    };
    Group.prototype.getChildren = function () {
        return this.factory.getGroupChildren(this.name, this.parent);
    };
    Group.prototype.toString = function () {
        return this.name;
    };
    Group = __decorate([
        core_1.injectable(), 
        __metadata('design:paramtypes', [])
    ], Group);
    return Group;
}(factory_1.BaseCommandRegistration));
exports.Group = Group;
//# sourceMappingURL=group.js.map