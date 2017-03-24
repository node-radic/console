"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../../src");
var groups_1 = require("./groups");
var GitFetchCommand = (function () {
    function GitFetchCommand() {
    }
    return GitFetchCommand;
}());
GitFetchCommand = __decorate([
    src_1.Registry.command('fetch', {
        group: groups_1.GitGroup,
        options: {
            a: { alias: 'append', desc: 'append to .git/FETCH_HEAD instead of overwriting' },
            'upload-pack': { type: 'string', desc: 'path to upload pack on remote end' }
        }
    })
], GitFetchCommand);
exports.GitFetchCommand = GitFetchCommand;
var GitDoPullCommand = (function () {
    function GitDoPullCommand() {
    }
    return GitDoPullCommand;
}());
GitDoPullCommand = __decorate([
    src_1.Registry.command('pull', {
        group: groups_1.GitDoGroup,
        arguments: {
            name: { desc: 'Project name', type: 'string', required: true }
        }
    })
], GitDoPullCommand);
exports.GitDoPullCommand = GitDoPullCommand;
//# sourceMappingURL=git.js.map