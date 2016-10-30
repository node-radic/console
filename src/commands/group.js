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
const core_1 = require("../core");
const factory_1 = require("./factory");
let Group = class Group extends factory_1.BaseCommandRegistration {
    handle() {
        this.showHelp();
    }
    showHelp(title, desc) {
        this.out
            .title(title || this.prettyName)
            .description(desc || this.desc)
            .line()
            .header(this.config('descriptor.text.commands'));
        this.descriptor.group(this);
        this.out.line();
    }
    getChildren() {
        return this.factory.getGroupChildren(this.name, this.parent);
    }
    toString() {
        return this.name;
    }
};
Group = __decorate([
    core_1.injectable(), 
    __metadata('design:paramtypes', [])
], Group);
exports.Group = Group;
//# sourceMappingURL=group.js.map