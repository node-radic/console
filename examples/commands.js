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
const src_1 = require("../src");
let TestCommand = class TestCommand extends src_1.Command {
    constructor() {
        super(...arguments);
        this.options = {
            f: { alias: 'file', desc: 'Path to a .json file', string: true },
            z: { alias: 'with-handler', desc: 'Path to a .json file', string: true },
        };
    }
    handle() { this.out.writeln('This is the data command'); }
};
TestCommand = __decorate([
    src_1.command('test', 'Testing command with a lot of opts and args'), 
    __metadata('design:paramtypes', [])
], TestCommand);
exports.TestCommand = TestCommand;
let DataCommand = class DataCommand extends src_1.Command {
    constructor() {
        super(...arguments);
        this.arguments = {};
        this.options = {};
    }
    handle() { this.out.writeln('This is the data command'); }
};
DataCommand = __decorate([
    src_1.command('data', 'Show important data'), 
    __metadata('design:paramtypes', [])
], DataCommand);
exports.DataCommand = DataCommand;
let DumpCommand = class DumpCommand extends src_1.Command {
    constructor() {
        super(...arguments);
        this.options = {};
    }
    handle() { this.out.writeln('This is the data command'); }
};
DumpCommand = __decorate([
    src_1.command('dump', 'Dump debug values'), 
    __metadata('design:paramtypes', [])
], DumpCommand);
exports.DumpCommand = DumpCommand;
let GitGroup = class GitGroup extends src_1.Group {
};
GitGroup = __decorate([
    src_1.group('git', 'Collection of git related commands'), 
    __metadata('design:paramtypes', [])
], GitGroup);
exports.GitGroup = GitGroup;
let GitCloneCommand = class GitCloneCommand extends src_1.Command {
    constructor() {
        super(...arguments);
        this.arguments = '{name:The name}';
        this.options = {
            h: { alias: 'with-hidden', desc: 'Include hidden objects', boolean: true }
        };
    }
    handle() {
        this.out.writeln('This is the git command');
        if (this.opt('h')) {
            this.out.writeln('With -h');
        }
    }
};
GitCloneCommand = __decorate([
    src_1.command('clone', 'Clone a local or remote repository by file path or URL', GitGroup), 
    __metadata('design:paramtypes', [])
], GitCloneCommand);
exports.GitCloneCommand = GitCloneCommand;
let GitRepoGroup = class GitRepoGroup extends src_1.Group {
};
GitRepoGroup = __decorate([
    src_1.group('repo', 'Manage remote repositories', GitGroup), 
    __metadata('design:paramtypes', [])
], GitRepoGroup);
exports.GitRepoGroup = GitRepoGroup;
let GitRepoListCommand = class GitRepoListCommand extends src_1.Command {
    constructor() {
        super(...arguments);
        this.options = {};
    }
    handle() { this.out.writeln('This is the con list command'); }
};
GitRepoListCommand = __decorate([
    src_1.command('list', 'List all repositories for the given connections', GitRepoGroup), 
    __metadata('design:paramtypes', [])
], GitRepoListCommand);
exports.GitRepoListCommand = GitRepoListCommand;
let ConnectionGroup = class ConnectionGroup extends src_1.Group {
};
ConnectionGroup = __decorate([
    src_1.group('con', 'Manage connections and authentication to services'), 
    __metadata('design:paramtypes', [])
], ConnectionGroup);
exports.ConnectionGroup = ConnectionGroup;
let ConnectionListCommand = class ConnectionListCommand extends src_1.Command {
    constructor() {
        super(...arguments);
        this.options = {};
    }
    handle() { this.out.writeln('This is the con list command'); }
};
ConnectionListCommand = __decorate([
    src_1.command('list', 'List all configured connections', ConnectionGroup), 
    __metadata('design:paramtypes', [])
], ConnectionListCommand);
exports.ConnectionListCommand = ConnectionListCommand;
let ConnectionAddCommand = class ConnectionAddCommand extends src_1.Command {
    constructor() {
        super(...arguments);
        this.options = {};
    }
    handle() { this.out.writeln('This is the con list command'); }
};
ConnectionAddCommand = __decorate([
    src_1.command('add', 'Add a new connection', ConnectionGroup), 
    __metadata('design:paramtypes', [])
], ConnectionAddCommand);
exports.ConnectionAddCommand = ConnectionAddCommand;
let ConnectionEditCommand = class ConnectionEditCommand extends src_1.Command {
    constructor() {
        super(...arguments);
        this.options = {};
    }
    handle() { this.out.writeln('This is the con list command'); }
};
ConnectionEditCommand = __decorate([
    src_1.command('edit', 'Edit existing connection', ConnectionGroup), 
    __metadata('design:paramtypes', [])
], ConnectionEditCommand);
exports.ConnectionEditCommand = ConnectionEditCommand;
let ConnectionRemoveCommand = class ConnectionRemoveCommand extends src_1.Command {
    constructor() {
        super(...arguments);
        this.options = {};
    }
    handle() { this.out.writeln('This is the con list command'); }
};
ConnectionRemoveCommand = __decorate([
    src_1.command('remove', 'Removes existing connection', ConnectionGroup), 
    __metadata('design:paramtypes', [])
], ConnectionRemoveCommand);
exports.ConnectionRemoveCommand = ConnectionRemoveCommand;
let JiraGroup = class JiraGroup extends src_1.Group {
};
JiraGroup = __decorate([
    src_1.group('jira', 'Interact with a Jira installation'), 
    __metadata('design:paramtypes', [])
], JiraGroup);
exports.JiraGroup = JiraGroup;
let JiraProjectsGroup = class JiraProjectsGroup extends src_1.Group {
};
JiraProjectsGroup = __decorate([
    src_1.group('projects', 'Interact with a Jira installation', JiraGroup), 
    __metadata('design:paramtypes', [])
], JiraProjectsGroup);
exports.JiraProjectsGroup = JiraProjectsGroup;
let JiraProjectsListCommand = class JiraProjectsListCommand extends src_1.Command {
    constructor() {
        super(...arguments);
        this.options = {};
    }
    handle() { this.out.writeln('This is the con list command'); }
};
JiraProjectsListCommand = __decorate([
    src_1.command('list', 'Removes existing connection', JiraProjectsGroup), 
    __metadata('design:paramtypes', [])
], JiraProjectsListCommand);
exports.JiraProjectsListCommand = JiraProjectsListCommand;
let JenkinsGroup = class JenkinsGroup extends src_1.Group {
};
JenkinsGroup = __decorate([
    src_1.group('jenkins', 'Discover and control a Jenkins server'), 
    __metadata('design:paramtypes', [])
], JenkinsGroup);
exports.JenkinsGroup = JenkinsGroup;
//# sourceMappingURL=commands.js.map