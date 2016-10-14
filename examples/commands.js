"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var src_1 = require("../src");
var GitGroup = (function (_super) {
    __extends(GitGroup, _super);
    function GitGroup() {
        _super.apply(this, arguments);
    }
    GitGroup = __decorate([
        src_1.group('git', 'Collection of git related commands'), 
        __metadata('design:paramtypes', [])
    ], GitGroup);
    return GitGroup;
}(src_1.Group));
exports.GitGroup = GitGroup;
var GitCloneCommand = (function (_super) {
    __extends(GitCloneCommand, _super);
    function GitCloneCommand() {
        _super.apply(this, arguments);
        this.arguments = '{name:The name}';
        this.options = {
            h: { alias: 'with-hidden', desc: 'Include hidden objects', boolean: true }
        };
    }
    GitCloneCommand.prototype.handle = function () {
        this.out.writeln('This is the git command');
        if (this.opt('h')) {
            this.out.writeln('With -h');
        }
    };
    GitCloneCommand = __decorate([
        src_1.command('clone', 'Clone a local or remote repository by file path or URL', GitGroup), 
        __metadata('design:paramtypes', [])
    ], GitCloneCommand);
    return GitCloneCommand;
}(src_1.Command));
exports.GitCloneCommand = GitCloneCommand;
var GitRepoGroup = (function (_super) {
    __extends(GitRepoGroup, _super);
    function GitRepoGroup() {
        _super.apply(this, arguments);
    }
    GitRepoGroup = __decorate([
        src_1.group('repo', 'Manage remote repositories', GitGroup), 
        __metadata('design:paramtypes', [])
    ], GitRepoGroup);
    return GitRepoGroup;
}(src_1.Group));
exports.GitRepoGroup = GitRepoGroup;
var GitRepoListCommand = (function (_super) {
    __extends(GitRepoListCommand, _super);
    function GitRepoListCommand() {
        _super.apply(this, arguments);
        this.options = {};
    }
    GitRepoListCommand.prototype.handle = function () { this.out.writeln('This is the con list command'); };
    GitRepoListCommand = __decorate([
        src_1.command('list', 'List all repositories for the given connections', GitRepoGroup), 
        __metadata('design:paramtypes', [])
    ], GitRepoListCommand);
    return GitRepoListCommand;
}(src_1.Command));
exports.GitRepoListCommand = GitRepoListCommand;
var ConnectionGroup = (function (_super) {
    __extends(ConnectionGroup, _super);
    function ConnectionGroup() {
        _super.apply(this, arguments);
    }
    ConnectionGroup = __decorate([
        src_1.group('con', 'Manage connections and authentication to services'), 
        __metadata('design:paramtypes', [])
    ], ConnectionGroup);
    return ConnectionGroup;
}(src_1.Group));
exports.ConnectionGroup = ConnectionGroup;
var ConnectionListCommand = (function (_super) {
    __extends(ConnectionListCommand, _super);
    function ConnectionListCommand() {
        _super.apply(this, arguments);
        this.options = {};
    }
    ConnectionListCommand.prototype.handle = function () { this.out.writeln('This is the con list command'); };
    ConnectionListCommand = __decorate([
        src_1.command('list', 'List all configured connections', ConnectionGroup), 
        __metadata('design:paramtypes', [])
    ], ConnectionListCommand);
    return ConnectionListCommand;
}(src_1.Command));
exports.ConnectionListCommand = ConnectionListCommand;
var ConnectionAddCommand = (function (_super) {
    __extends(ConnectionAddCommand, _super);
    function ConnectionAddCommand() {
        _super.apply(this, arguments);
        this.options = {};
    }
    ConnectionAddCommand.prototype.handle = function () { this.out.writeln('This is the con list command'); };
    ConnectionAddCommand = __decorate([
        src_1.command('add', 'Add a new connection', ConnectionGroup), 
        __metadata('design:paramtypes', [])
    ], ConnectionAddCommand);
    return ConnectionAddCommand;
}(src_1.Command));
exports.ConnectionAddCommand = ConnectionAddCommand;
var ConnectionEditCommand = (function (_super) {
    __extends(ConnectionEditCommand, _super);
    function ConnectionEditCommand() {
        _super.apply(this, arguments);
        this.options = {};
    }
    ConnectionEditCommand.prototype.handle = function () { this.out.writeln('This is the con list command'); };
    ConnectionEditCommand = __decorate([
        src_1.command('edit', 'Edit existing connection', ConnectionGroup), 
        __metadata('design:paramtypes', [])
    ], ConnectionEditCommand);
    return ConnectionEditCommand;
}(src_1.Command));
exports.ConnectionEditCommand = ConnectionEditCommand;
var ConnectionRemoveCommand = (function (_super) {
    __extends(ConnectionRemoveCommand, _super);
    function ConnectionRemoveCommand() {
        _super.apply(this, arguments);
        this.options = {};
    }
    ConnectionRemoveCommand.prototype.handle = function () { this.out.writeln('This is the con list command'); };
    ConnectionRemoveCommand = __decorate([
        src_1.command('remove', 'Removes existing connection', ConnectionGroup), 
        __metadata('design:paramtypes', [])
    ], ConnectionRemoveCommand);
    return ConnectionRemoveCommand;
}(src_1.Command));
exports.ConnectionRemoveCommand = ConnectionRemoveCommand;
var JiraGroup = (function (_super) {
    __extends(JiraGroup, _super);
    function JiraGroup() {
        _super.apply(this, arguments);
    }
    JiraGroup = __decorate([
        src_1.group('jira', 'Interact with a Jira installation'), 
        __metadata('design:paramtypes', [])
    ], JiraGroup);
    return JiraGroup;
}(src_1.Group));
exports.JiraGroup = JiraGroup;
var JiraProjectsGroup = (function (_super) {
    __extends(JiraProjectsGroup, _super);
    function JiraProjectsGroup() {
        _super.apply(this, arguments);
    }
    JiraProjectsGroup = __decorate([
        src_1.group('projects', 'Interact with a Jira installation', JiraGroup), 
        __metadata('design:paramtypes', [])
    ], JiraProjectsGroup);
    return JiraProjectsGroup;
}(src_1.Group));
exports.JiraProjectsGroup = JiraProjectsGroup;
var JiraProjectsListCommand = (function (_super) {
    __extends(JiraProjectsListCommand, _super);
    function JiraProjectsListCommand() {
        _super.apply(this, arguments);
        this.options = {};
    }
    JiraProjectsListCommand.prototype.handle = function () { this.out.writeln('This is the con list command'); };
    JiraProjectsListCommand = __decorate([
        src_1.command('list', 'Removes existing connection', JiraProjectsGroup), 
        __metadata('design:paramtypes', [])
    ], JiraProjectsListCommand);
    return JiraProjectsListCommand;
}(src_1.Command));
exports.JiraProjectsListCommand = JiraProjectsListCommand;
var JenkinsGroup = (function (_super) {
    __extends(JenkinsGroup, _super);
    function JenkinsGroup() {
        _super.apply(this, arguments);
    }
    JenkinsGroup = __decorate([
        src_1.group('jenkins', 'Discover and control a Jenkins server'), 
        __metadata('design:paramtypes', [])
    ], JenkinsGroup);
    return JenkinsGroup;
}(src_1.Group));
exports.JenkinsGroup = JenkinsGroup;
var DataCommand = (function (_super) {
    __extends(DataCommand, _super);
    function DataCommand() {
        _super.apply(this, arguments);
        this.options = {};
    }
    DataCommand.prototype.handle = function () { this.out.writeln('This is the data command'); };
    DataCommand = __decorate([
        src_1.command('data', 'Show important data'), 
        __metadata('design:paramtypes', [])
    ], DataCommand);
    return DataCommand;
}(src_1.Command));
exports.DataCommand = DataCommand;
var DumpCommand = (function (_super) {
    __extends(DumpCommand, _super);
    function DumpCommand() {
        _super.apply(this, arguments);
        this.options = {};
    }
    DumpCommand.prototype.handle = function () { this.out.writeln('This is the data command'); };
    DumpCommand = __decorate([
        src_1.command('dump', 'Dump debug values'), 
        __metadata('design:paramtypes', [])
    ], DumpCommand);
    return DumpCommand;
}(src_1.Command));
exports.DumpCommand = DumpCommand;
//# sourceMappingURL=commands.js.map