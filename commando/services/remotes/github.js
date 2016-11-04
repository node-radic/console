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
const _ = require('lodash');
const remote_1 = require("../remote");
let GithubRemote = class GithubRemote extends remote_1.GitRestRemote {
    constructor(...args) {
        super(...args);
        this.usesExtra = false;
    }
    getMirrorUrl(owner, repo) {
        return `https://github.com/${owner}/${repo}`;
    }
    getAuthMethods() { return [remote_1.AuthMethod.basic, remote_1.AuthMethod.oauth2, remote_1.AuthMethod.oauth]; }
    init() {
        this.mergeDefaults({
            baseUrl: 'https://api.github.com/',
            auth: { username: this.connection.key, password: this.connection.secret },
            headers: {
                'User-Agent': 'Commando',
            }
        });
    }
    getRepositories(owner) {
        return this.getUser().then((res) => {
            let repos = owner.toLowerCase() === res.login.toLowerCase() ? this.get('user/repos') : this.post(`orgs/${owner}/repos`);
            repos.then((repos) => {
                console.dir(repos);
            });
        });
    }
    getRepository(owner, repo) {
        return this.get(`repos/${owner}/${repo}`);
    }
    createRepository(owner, repo, opts = {}) {
        return this.getUser().then((res) => {
            opts = _.merge({ name: repo }, opts);
            return owner.toLowerCase() === res.login.toLowerCase() ? this.post('user/repos', opts) : this.post(`orgs/${owner}/repos`, opts);
        });
    }
    deleteRepository(owner, repo) {
        return this.delete(`repos/${owner}/${repo}`);
    }
    getUser(username) {
        return username ? this.get(`users/${username}`) : this.get('user');
    }
    getUserTeams(username) {
        let teams = username ? this.get(`users/${username}/orgs`) : this.get('user/orgs');
        return teams.then((res) => {
            return new Promise((resolve, reject) => {
                resolve(Object.keys(_.keyBy(res, 'login')));
            });
        });
    }
    getUserRepositories(username) {
        return username ? this.get(`users/${username}/repos`) : this.get('user/repos');
    }
    getTeam(team) {
        return this.get(`orgs/${team}`);
    }
    getTeamRepositories(team) {
        return this.get(`orgs/${team}/repos`);
    }
};
GithubRemote = __decorate([
    remote_1.remote('github', 'Github', 'git'), 
    __metadata('design:paramtypes', [])
], GithubRemote);
exports.GithubRemote = GithubRemote;
//# sourceMappingURL=github.js.map