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
const src_1 = require("../../src");
let InitCommand = class InitCommand extends src_1.Command {
    handle() {
        this.out.success('Success');
    }
};
InitCommand = __decorate([
    src_1.command('init', 'Initialize R', 'Give the current working directory a bit of R.'), 
    __metadata('design:paramtypes', [])
], InitCommand);
exports.InitCommand = InitCommand;
let TestCommand = class TestCommand extends src_1.Command {
    handle() {
        this.out.success('Success');
    }
};
TestCommand = __decorate([
    src_1.command('test', 'Test R', 'Test a bit of R.'), 
    __metadata('design:paramtypes', [])
], TestCommand);
exports.TestCommand = TestCommand;
//# sourceMappingURL=all.js.map