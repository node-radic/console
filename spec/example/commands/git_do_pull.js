"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../../src");
var git_do_1 = require("./git_do");
var GitDoPullCommand = (function (_super) {
    __extends(GitDoPullCommand, _super);
    function GitDoPullCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return GitDoPullCommand;
}(src_1.Command));
GitDoPullCommand = __decorate([
    src_1.command('pull', {
        group: git_do_1.GitDoGroup,
        arguments: {
            name: { desc: 'Project name', type: 'string', required: true }
        }
    })
], GitDoPullCommand);
exports.GitDoPullCommand = GitDoPullCommand;
//# sourceMappingURL=git_do_pull.js.map