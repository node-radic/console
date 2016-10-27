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
var kernel_1 = require("./kernel");
var Helpers = (function () {
    function Helpers() {
        this.helpers = {};
    }
    Helpers.prototype.get = function (name) {
        return this.helpers[name];
    };
    Helpers.prototype.set = function (name, helper) {
        this.helpers[name] = helper;
        return this;
    };
    Helpers.prototype.has = function (name) {
        return this.helpers[name] !== undefined;
    };
    Helpers = __decorate([
        kernel_1.injectable(), 
        __metadata('design:paramtypes', [])
    ], Helpers);
    return Helpers;
}());
exports.Helpers = Helpers;
//# sourceMappingURL=helpers.js.map