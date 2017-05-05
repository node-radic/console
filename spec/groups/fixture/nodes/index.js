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
var src_1 = require("../../../../src");
__export(require("./yarn"));
__export(require("./yarn_install"));
var ConnectGroup = (function () {
    function ConnectGroup() {
    }
    return ConnectGroup;
}());
ConnectGroup = __decorate([
    src_1.group('connect', 'SSH connection helper')
], ConnectGroup);
exports.ConnectGroup = ConnectGroup;
var ConnectSetCommand = (function () {
    function ConnectSetCommand() {
    }
    return ConnectSetCommand;
}());
ConnectSetCommand = __decorate([
    src_1.command('set', 'Add/edit a connection.', ConnectGroup)
], ConnectSetCommand);
exports.ConnectSetCommand = ConnectSetCommand;
var ConnectGetCommand = (function () {
    function ConnectGetCommand() {
    }
    return ConnectGetCommand;
}());
ConnectGetCommand = __decorate([
    src_1.command('get', 'Print a connection.', ConnectGroup)
], ConnectGetCommand);
exports.ConnectGetCommand = ConnectGetCommand;
var ConnectDeleteCommand = (function () {
    function ConnectDeleteCommand() {
    }
    return ConnectDeleteCommand;
}());
ConnectDeleteCommand = __decorate([
    src_1.command('delete', 'Delete a connection.', ConnectGroup)
], ConnectDeleteCommand);
exports.ConnectDeleteCommand = ConnectDeleteCommand;
var GitGroup = (function () {
    function GitGroup() {
    }
    return GitGroup;
}());
GitGroup = __decorate([
    src_1.group('git', 'Remote Git operations.')
], GitGroup);
exports.GitGroup = GitGroup;
var GitRepoGroup = (function () {
    function GitRepoGroup() {
    }
    return GitRepoGroup;
}());
GitRepoGroup = __decorate([
    src_1.group('repo', 'Repository operations', GitGroup)
], GitRepoGroup);
exports.GitRepoGroup = GitRepoGroup;
var GitRepoCreateCommand = (function () {
    function GitRepoCreateCommand() {
    }
    return GitRepoCreateCommand;
}());
GitRepoCreateCommand = __decorate([
    src_1.command('create', 'Create a repository', GitRepoGroup)
], GitRepoCreateCommand);
exports.GitRepoCreateCommand = GitRepoCreateCommand;
var GitRepoDeleteCommand = (function () {
    function GitRepoDeleteCommand() {
    }
    return GitRepoDeleteCommand;
}());
GitRepoDeleteCommand = __decorate([
    src_1.command('delete', 'Delete a repository', GitRepoGroup)
], GitRepoDeleteCommand);
exports.GitRepoDeleteCommand = GitRepoDeleteCommand;
var GitRepoMirrorCommand = (function () {
    function GitRepoMirrorCommand() {
    }
    return GitRepoMirrorCommand;
}());
GitRepoMirrorCommand = __decorate([
    src_1.command('mirror', 'Mirror a repository to another', GitRepoGroup)
], GitRepoMirrorCommand);
exports.GitRepoMirrorCommand = GitRepoMirrorCommand;
//# sourceMappingURL=index.js.map