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
var Input_1 = require("../../../../src/helpers/Input");
var Describer_1 = require("../../../../src/helpers/Describer");
var YarnInstallCommand = (function () {
    function YarnInstallCommand() {
    }
    YarnInstallCommand.prototype.handle = function () {
        var desc = this.desc.command(this);
    };
    YarnInstallCommand.prototype.dumpStuff = function () {
        this.out.line('{green}THIS:{reset}');
        this.out.dump(this);
        this.out.line('{green}CONFIG:{reset}');
        this.out.dump(this.config.get('helpers.input'));
        this.out.line('{green}THIS.in:{reset}');
        this.out.dump(this.in);
        if (this.global)
            this.out.success('global');
    };
    return YarnInstallCommand;
}());
__decorate([
    ioc_1.inject('console.helpers.output'),
    __metadata("design:type", Output_1.Output)
], YarnInstallCommand.prototype, "out", void 0);
__decorate([
    ioc_1.inject('console.helpers.input'),
    __metadata("design:type", Input_1.Input)
], YarnInstallCommand.prototype, "in", void 0);
__decorate([
    ioc_1.inject('console.helpers.describer'),
    __metadata("design:type", Describer_1.Describer)
], YarnInstallCommand.prototype, "desc", void 0);
__decorate([
    ioc_1.inject('console.config'),
    __metadata("design:type", Function)
], YarnInstallCommand.prototype, "config", void 0);
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