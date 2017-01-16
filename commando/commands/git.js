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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const src_1 = require("../../src");
const core_1 = require("../core");
const con_1 = require("./con");
const async = require('async');
const remote_1 = require("../services/remote");
const _ = require('lodash');
let GitGroup = class GitGroup extends src_1.Group {
};
GitGroup = __decorate([
    src_1.group('git', 'Git Helpers', 'Gi'), 
    __metadata('design:paramtypes', [])
], GitGroup);
exports.GitGroup = GitGroup;
let GitCommand = class GitCommand extends con_1.ConnectionCommand {
    askConnection(filter = {}) {
        filter.type = 'git';
        let gitConnections = this.connections.query.filter(filter).map('name').value();
        if (gitConnections.length === 1) {
            return new Promise((resolve, reject) => {
                this.log.info('Automatically selected the only connection matching the requirements: ' + gitConnections[0]);
                resolve(gitConnections[0]);
            });
        }
        return this.askArg('connection', { type: 'list', choices: gitConnections });
    }
    getProjects(connection) {
        connection.getRemote().getUserTeams();
    }
    createGitCache() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.connections.filter({ type: 'git', remote: 'github' }).forEach((con) => {
                    this.out.subtitle('Using connection: ' + con.name);
                    let rem = con.getRemote();
                    rem.getUser().catch(console.error.bind(console)).then((data) => {
                        this.out.header('getUser').dump(data);
                        return rem.getUserRepositories().catch(console.error.bind(console));
                    }).then((data) => {
                        this.out.header('getUserRepositories').dump(data);
                        return rem.getUserTeams().catch(console.error.bind(console));
                    }).then((data) => {
                        this.out.header('getUserTeams').dump(data);
                    });
                });
            });
        });
    }
};
GitCommand = __decorate([
    core_1.injectable(), 
    __metadata('design:paramtypes', [])
], GitCommand);
exports.GitCommand = GitCommand;
let GitInitCommand = class GitInitCommand extends GitCommand {
    handle() {
        this.createGitCache().then((data) => {
            this.out.title('createGitCache');
            this.out.dump(data);
        });
    }
};
GitInitCommand = __decorate([
    src_1.command('init', 'Initialize Git project', 'Give the current working directory a bit of R.', GitGroup), 
    __metadata('design:paramtypes', [])
], GitInitCommand);
exports.GitInitCommand = GitInitCommand;
let GitListCommand = class GitListCommand extends GitCommand {
    constructor() {
        super(...arguments);
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
let DeleteGitRepoCommand = class DeleteGitRepoCommand extends GitCommand {
    constructor() {
        super(...arguments);
        this.arguments = {
            connection: { desc: 'Connection to use', type: 'string' },
            project: { desc: 'The project (aka "team" or "owner" or "organisation")', type: 'string' },
            repository: { desc: 'The repository name', type: 'string' }
        };
    }
    handle() {
        let con, rem, ans;
        this.askConnection().then((connection) => {
            con = this.connections.get(connection);
            rem = con.getRemote();
            return rem.getUserTeams();
        }).then((teams) => {
            return this.in.askArgs(this.parsed, {
                project: { type: 'list', choices: teams },
                repository: {}
            });
        }).then((answers) => {
            ans = answers;
            return rem.deleteRepository(ans.project, ans.repository);
        }).then((res) => {
            this.out.success(`Deleted repository "${ans.project}/${ans.repository}" on connection "${con.name}"`);
        }, this.fail.bind(this));
    }
};
DeleteGitRepoCommand = __decorate([
    src_1.command('delete', 'Delete repository', 'Delete remote repository', GitRepoGroup), 
    __metadata('design:paramtypes', [])
], DeleteGitRepoCommand);
exports.DeleteGitRepoCommand = DeleteGitRepoCommand;
let MirrorGitRepoCommand = class MirrorGitRepoCommand extends GitCommand {
    constructor() {
        super(...arguments);
        this.arguments = {
            connection: { desc: 'Connection to use', type: 'string' },
            project: { desc: 'The project/team/owner', type: 'string' },
            repository: { desc: 'The repository name', type: 'string' }
        };
        this.options = {
            a: { alias: 'add-mirror', desc: 'Add a mirrored repository', array: true },
            u: { alias: 'unhook-all', desc: 'Unhook all mirrors', boolean: true },
            l: { alias: 'list', desc: 'List all mirrors', boolean: true }
        };
        this.hookKey = 'com.englishtown.stash-hook-mirror:mirror-repository-hook';
    }
    handle() {
        this.handleArguments({ remote: 'bitbucket_server' }).then(() => {
            if (this.opt('u'))
                return this.handleUnhookAll(this.project, this.repository);
            if (this.opt('l'))
                return this.handleList();
            this.handleMirrorRepositories(this.project, this.repository, this.opt('a') || []);
        }, this.fail.bind(this));
    }
    handleList() {
        this.getMirrorsList(this.project, this.repository).then((list) => {
            this.out.header(`Mirror list (${list.length} mirrors)`);
            list.forEach((mirror) => {
                this.out.line(' - ' + mirror);
            });
        });
    }
    getMirrorsList(project, repo) {
        return this.rem.get(`projects/${project}/repos/${repo}/settings/hooks/${this.hookKey}/settings`, {}).then((res) => {
            let list = [];
            Object.keys(res).forEach((key) => {
                if (!key.startsWith('mirrorRepoUrl'))
                    return;
                list.push(res[key]);
            });
            return new Promise((resolve, reject) => {
                resolve(list);
            });
        });
    }
    handleUnhookAll(project, repo) {
        this.rem.put(`projects/${project}/repos/${repo}/settings/hooks/${this.hookKey}/settings`, {}).then((res) => {
            this.log.info('All mirrors unhooked');
            this.log.silly('Response', res);
        });
    }
    handleArguments(filter = {}) {
        return this.askConnection().then((connection) => {
            this.con = this.connections.get(connection);
            this.rem = this.con.getRemote();
            return this.rem.getUserTeams();
        }).then((teams) => {
            return this.askArgs({
                project: { type: 'list', choices: teams },
                repository: {}
            }).then((answers) => {
                this.project = answers.project;
                this.repository = answers.repository;
            });
        }, this.fail.bind(this));
    }
    handleMirrorRepositories(project, repo, mirrors) {
        return this.createMirrors(project, repo, mirrors);
    }
    createMirrors(project, repo, mirrors) {
        let rem = this.con.getRemote();
        let jobs = [
                (done) => rem.put(`projects/${project}/repos/${repo}/settings/hooks/${this.hookKey}/enabled`).then(() => done(), this.fail.bind(this))
        ];
        this.parseMirrors(project, repo, mirrors).forEach((mirror) => {
            this.log.verbose('adding mirror', _.omit(mirror, 'con', 'rem'));
            jobs.push((done) => {
                if (mirror.con.getMethod() !== remote_1.AuthMethod.basic) {
                    this.fail(`Cannot mirror "${mirror.name}". Mirroring only supports basic auth method for mirrors`);
                }
                this.createMirror(project, repo, mirror).then((res) => {
                    this.log.verbose('put hook settings res', res);
                    this.log.info(`Hook created on "${mirror.con.name}" > "${mirror.project}/${mirror.repo}"`);
                    done();
                });
            });
        });
        return new Promise((resolve, reject) => {
            async.waterfall(jobs, (err, res) => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
    parseMirrors(project, repo, mirrors) {
        return mirrors.map((raw) => {
            return this.parseMirror(raw, project, repo);
        });
    }
    createMirror(project, repo, mirror) {
        let rem = this.con.getRemote();
        return rem.get(`projects/${project}/repos/${repo}/settings/hooks/${this.hookKey}/settings`).then((res) => {
            this.log.verbose('get hook settings', res);
            return new Promise((resolve, reject) => {
                let len = Object.keys(res).length;
                let suffix = len === 0 ? 0 : (len / 3);
                this.log.verbose('put hook suffix for: ' + mirror.rem.name, { len, suffix });
                let data = {};
                data['username' + suffix] = mirror.con.key;
                data['password' + suffix] = mirror.con.secret;
                data['mirrorRepoUrl' + suffix] = mirror.rem.getMirrorUrl(mirror.project, mirror.repo);
                resolve(_.merge(res, data));
            });
        }).then((data) => {
            this.log.verbose('put hook settings data', data);
            return rem.put(`projects/${project}/repos/${repo}/settings/hooks/${this.hookKey}/settings`, data);
        });
    }
    parseMirror(mirror, project, repo) {
        let withRepo = mirror.indexOf(':') !== -1;
        let name = withRepo ? mirror.split(':')[0] : mirror;
        let mProject = project;
        let mRepo = repo;
        if (withRepo) {
            let to = mirror.split(':')[1];
            mProject = to.split('/')[0];
            if (to.split('/').length > 1) {
                mRepo = to.split('/')[1];
            }
        }
        if (!this.connections.has(name)) {
            this.fail(`Could not find mirror "${name}"`);
        }
        let con = this.connections.get(name);
        return { name: name, con: con, rem: con.getRemote(), project: mProject, repo: mRepo, raw: mirror };
    }
};
__decorate([
    core_1.inject(core_1.COMMANDO.CACHE), 
    __metadata('design:type', Object)
], MirrorGitRepoCommand.prototype, "cache", void 0);
MirrorGitRepoCommand = __decorate([
    src_1.command('mirror', 'Mirror repositories', 'Mirror hook repositories', GitRepoGroup), 
    __metadata('design:paramtypes', [])
], MirrorGitRepoCommand);
exports.MirrorGitRepoCommand = MirrorGitRepoCommand;
let CreateGitRepoCommand = class CreateGitRepoCommand extends MirrorGitRepoCommand {
    constructor() {
        super(...arguments);
        this.options = {
            m: { alias: 'mirrored', desc: 'Create a mirrored repository', boolean: true },
            a: { alias: 'add-mirror', desc: 'Add a mirrored repository', array: true },
            o: { alias: 'option', desc: 'Set option for remote (eg "description")', default: { private: false, has_wiki: false, description: '' } }
        };
    }
    handle() {
        let mirrored = this.opt('m');
        this.handleArguments(mirrored ? { remote: 'bitbucket_server' } : {}).then(() => {
            if (mirrored) {
                return this.handleCreateMirrored(this.project, this.repository);
            }
            return this.handleCreate(this.project, this.repository);
        });
    }
    handleCreateMirrored(project, repo) {
        let rem = this.con.getRemote();
        let mirrors = this.opt('a');
        return this.createRepository(project, repo, rem).then(() => {
            return this.createMirrors(project, repo, mirrors);
        }).then(() => {
            let jobs = [];
            this.parseMirrors(project, repo, mirrors).forEach((mirror) => {
                jobs.push((done) => this.createRepository(mirror.project, mirror.repo, mirror.rem).then(() => {
                    this.log.info(`Repository created on "${mirror.con.name}" > "${mirror.project}/${mirror.repo}"`);
                    done();
                }));
            });
            async.waterfall(jobs, (err) => {
                if (err)
                    this.fail(err.message);
                this.log.info('Mirrored repositories created');
            });
        });
    }
    handleCreate(owner, repo, rem) {
        return this.createRepository(owner, repo, rem);
    }
    createRepository(owner, repo, rem) {
        rem = rem || this.con.getRemote();
        return rem.createRepository(owner, repo, this.opt('o')).then((res) => {
            this.log.info(`Repository "${owner}/${repo}" created on connection "${this.con.name}"`);
        }, this.fail.bind(this));
    }
};
CreateGitRepoCommand = __decorate([
    src_1.command('create', 'Create repository', 'Create a (mirrored) repository', GitRepoGroup), 
    __metadata('design:paramtypes', [])
], CreateGitRepoCommand);
exports.CreateGitRepoCommand = CreateGitRepoCommand;
//# sourceMappingURL=git.js.map