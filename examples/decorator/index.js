"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var groups_1 = require("./groups");
var src_1 = require("../../src");
__export(require("./groups"));
__export(require("./git"));
var InitCommand = (function () {
    function InitCommand() {
    }
    InitCommand.prototype.handle = function () {
        console.log({ name: this.name });
    };
    return InitCommand;
}());
InitCommand = __decorate([
    src_1.Registry.command('init', {
        arguments: {
            name: { desc: 'Project name', type: 'string', required: true }
        }
    })
], InitCommand);
exports.InitCommand = InitCommand;
var ComposerRequireCommand = (function () {
    function ComposerRequireCommand() {
    }
    return ComposerRequireCommand;
}());
ComposerRequireCommand = __decorate([
    src_1.Registry.command('require', {
        group: groups_1.ComposerGroup,
        arguments: {
            name: { desc: 'Project name', type: 'string', required: true }
        }
    })
], ComposerRequireCommand);
exports.ComposerRequireCommand = ComposerRequireCommand;
//# sourceMappingURL=index.js.map