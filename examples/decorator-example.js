"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../src");
var cli = src_1.Cli.getInstance();
cli.config({ mode: 'groups' });
cli.options({
    v: { alias: 'verbose', desc: 'be more verbose', global: true, count: 3 },
    h: { alias: 'help', desc: 'shows help', global: true }
});
var ComposerGroup = cli.group('composer');
var InitCommand = (function () {
    function InitCommand() {
    }
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
var GitGroup = (function () {
    function GitGroup() {
    }
    return GitGroup;
}());
GitGroup = __decorate([
    src_1.Registry.group('git')
], GitGroup);
exports.GitGroup = GitGroup;
var GitFetchCommand = (function () {
    function GitFetchCommand() {
    }
    return GitFetchCommand;
}());
GitFetchCommand = __decorate([
    src_1.Registry.command('fetch', {
        group: GitGroup,
        options: {
            a: { alias: 'append', desc: 'append to .git/FETCH_HEAD instead of overwriting' },
            'upload-pack': { type: 'string', desc: 'path to upload pack on remote end' }
        }
    })
], GitFetchCommand);
exports.GitFetchCommand = GitFetchCommand;
var GitDoGroup = (function () {
    function GitDoGroup() {
    }
    return GitDoGroup;
}());
GitDoGroup = __decorate([
    src_1.Registry.group('do', { group: GitGroup })
], GitDoGroup);
exports.GitDoGroup = GitDoGroup;
var GitDoPullCommand = (function () {
    function GitDoPullCommand() {
    }
    return GitDoPullCommand;
}());
GitDoPullCommand = __decorate([
    src_1.Registry.command('pull', {
        group: GitDoGroup,
        arguments: {
            name: { desc: 'Project name', type: 'string', required: true }
        }
    })
], GitDoPullCommand);
exports.GitDoPullCommand = GitDoPullCommand;
var ComposerRequireCommand = (function () {
    function ComposerRequireCommand() {
    }
    return ComposerRequireCommand;
}());
ComposerRequireCommand = __decorate([
    src_1.Registry.command('require', {
        group: ComposerGroup,
        arguments: {
            name: { desc: 'Project name', type: 'string', required: true }
        }
    })
], ComposerRequireCommand);
exports.ComposerRequireCommand = ComposerRequireCommand;
var tree = cli.parse('git 123312 -a -vv'.split(' '));
cli.dump(tree);
//# sourceMappingURL=decorator-example.js.map