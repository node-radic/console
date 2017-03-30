"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var decorators_1 = require("../../src/decorators");
var yarn_1 = require("./yarn");
var YarnInstallCommand = (function () {
    function YarnInstallCommand() {
    }
    YarnInstallCommand.prototype.handle = function () {
    };
    return YarnInstallCommand;
}());
YarnInstallCommand = __decorate([
    decorators_1.command('install', {
        group: yarn_1.YarnGroup,
        options: {
            g: { alias: 'global', desc: 'Install packages globally' }
        },
        arguments: {
            packages: { desc: 'One or more packages to install', required: false, type: 'array' }
        }
    })
], YarnInstallCommand);
exports.YarnInstallCommand = YarnInstallCommand;
//# sourceMappingURL=yarn_install.js.map