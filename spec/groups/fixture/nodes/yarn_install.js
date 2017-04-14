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
var decorators_1 = require("../../../../src/decorators");
var yarn_1 = require("./yarn");
var ioc_1 = require("../../../../src/core/ioc");
var Output_1 = require("../../../../src/helpers/Output");
var YarnInstallCommand = (function () {
    function YarnInstallCommand() {
    }
    YarnInstallCommand.prototype.handle = function () {
        if (this.packages.length > 0) {
            this.installPackages(this.packages);
        }
        else {
            var pkg_1 = require('./package.json');
            var packages = Object.keys(pkg_1.dependencies).map(function (name) {
                return name + '@' + pkg_1.dependencies[name];
            });
            this.installPackages(packages);
        }
        this.out.line("packages: " + this.packages.join(', '));
        if (this.global)
            this.out.success('global');
    };
    YarnInstallCommand.prototype.installPackages = function (packages) {
        if (this.global) {
        }
    };
    return YarnInstallCommand;
}());
__decorate([
    ioc_1.inject('console.helpers.output'),
    __metadata("design:type", Output_1.default)
], YarnInstallCommand.prototype, "out", void 0);
YarnInstallCommand = __decorate([
    decorators_1.command('install', {
        group: yarn_1.YarnGroup,
        options: {
            g: { alias: 'global', desc: 'Install packages globally' }
        },
        arguments: {
            packages: { desc: 'One or more packages to install', required: false, type: 'array', default: [] }
        }
    })
], YarnInstallCommand);
exports.YarnInstallCommand = YarnInstallCommand;
//# sourceMappingURL=yarn_install.js.map