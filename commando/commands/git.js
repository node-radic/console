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
const src_1 = require("../../src");
const core_1 = require("../core");
const con_1 = require("./con");
let GitGroup = class GitGroup extends src_1.Group {
};
GitGroup = __decorate([
    src_1.group('git', 'Git Helpers', 'Gi'), 
    __metadata('design:paramtypes', [])
], GitGroup);
exports.GitGroup = GitGroup;
let GitCommand = class GitCommand extends con_1.ConnectionCommand {
    askConnection() {
        this.connections.filter({});
    }
};
GitCommand = __decorate([
    core_1.injectable(), 
    __metadata('design:paramtypes', [])
], GitCommand);
exports.GitCommand = GitCommand;
let GitInitCommand = class GitInitCommand extends GitCommand {
    constructor(...args) {
        super(...args);
        this.arguments = {
            arg: { desc: '', type: 'string', required: false, default: 'defaultValue' }
        };
        this.options = {
            o: { alias: 'opt', desc: '', string: true, default: 'deefaultVAlue' }
        };
    }
    handle() {
    }
};
GitInitCommand = __decorate([
    src_1.command('init', 'Initialize Git project', 'Give the current working directory a bit of R.', GitGroup), 
    __metadata('design:paramtypes', [])
], GitInitCommand);
exports.GitInitCommand = GitInitCommand;
let GitListCommand = class GitListCommand extends GitCommand {
    constructor(...args) {
        super(...args);
        this.arguments = {};
        this.options = {};
    }
    handle() {
        this.connections.filter();
        this.out.line('This is the ls /  command');
    }
};
GitListCommand = __decorate([
    src_1.command('ls', 'Git List', 'List something', GitGroup), 
    __metadata('design:paramtypes', [])
], GitListCommand);
exports.GitListCommand = GitListCommand;
let GitRepoGroup = class GitRepoGroup extends src_1.Group {
};
GitRepoGroup = __decorate([
    src_1.group('repo', 'Git Repository Commands', 'Git repository commands', GitGroup), 
    __metadata('design:paramtypes', [])
], GitRepoGroup);
exports.GitRepoGroup = GitRepoGroup;
let CreateGitRepoCommand = class CreateGitRepoCommand extends GitCommand {
    constructor(...args) {
        super(...args);
        this.arguments = {
            connection: { desc: 'Connection to use', type: 'string' },
            repository: { desc: 'The full repository name (owner/name) eg: "robinradic/blade-extensions"', type: 'string' }
        };
        this.options = {
            m: { alias: 'mirrored', desc: 'Create a mirrored repository', boolean: true }
        };
    }
    handle() {
        let mirrored = this.opt('m');
        let filter = { type: 'git' };
        if (mirrored)
            filter.remote = 'bitbucket_server';
        let gitConnections = this.connections.query.filter(filter).map('name').value();
        if (gitConnections.length === 1) {
            this.log.info('Automatically selected the only connection matching the requirements: ' + gitConnections[0]);
        }
        this.in.askArgs(this.parsed, {
            connection: { choices: gitConnections, type: 'list', when: () => gitConnections.length > 1, default: gitConnections[0] },
            repository: { validate: (input) => input.split('/')[0].length > 1 && input.split('/')[1] !== undefined && input.split('/')[1].length > 1 }
        }).then((answers) => {
            this.con = this.connections.get(answers.connection);
            if (mirrored) {
                return this.createMirroredRepository();
            }
            let rem = this.con.getRemote();
            let repo = answers.repository.toString().split('/');
            this.createRepository(repo[0], repo[1]);
        });
    }
    createMirroredRepository() {
        console.log('createMirroredRepository', arguments);
    }
    createRepository(owner, repo) {
        console.log('createRepository', arguments);
        let rem = this.con.getRemote();
        rem.getRepositories(owner);
    }
};
CreateGitRepoCommand = __decorate([
    src_1.command('create', 'Create repository', 'List something', GitRepoGroup), 
    __metadata('design:paramtypes', [])
], CreateGitRepoCommand);
exports.CreateGitRepoCommand = CreateGitRepoCommand;
//# sourceMappingURL=git.js.map