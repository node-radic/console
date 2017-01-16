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
let BitbucketRemote = class BitbucketRemote extends remote_1.GitRestRemote {
    constructor() {
        super(...arguments);
        this.usesExtra = false;
    }
    getMirrorUrl(owner, repo) {
        return `https://bitbucket.org/${owner}/${repo}`;
    }
    getAuthMethods() { return [remote_1.AuthMethod.basic, remote_1.AuthMethod.oauth2, remote_1.AuthMethod.oauth]; }
    init() {
        this.mergeDefaults({
            baseUrl: 'https://api.bitbucket.org/2.0',
            auth: { username: this.connection.key, password: this.connection.secret }
        });
    }
    getUserRepositories(username) {
        return undefined;
    }
    getUserTeams(username, opts = {}) {
        return this.get('teams', _.merge({ role: 'member', pagelen: 100 }, opts)).then((res) => {
            return new Promise((resolve, reject) => {
                resolve(Object.keys(_.keyBy(res.values, 'username')));
            });
        });
    }
    deleteRepository(owner, repo) {
        return this.delete(`repositories/${owner}/${repo}`);
    }
    createRepository(owner, repo, opts = {}) {
        return this.post(`repositories/${owner}/${repo}`, _.merge({}, opts));
    }
    getRepositories(owner) {
        return undefined;
    }
    getRepository(owner, repo) {
        return undefined;
    }
    getUser(username) {
        return this.get('user');
    }
    getTeam(team) {
        return undefined;
    }
    getTeamRepositories(team) {
        return undefined;
    }
};
BitbucketRemote = __decorate([
    remote_1.remote('bitbucket', 'Bitbucket', "git"), 
    __metadata('design:paramtypes', [])
], BitbucketRemote);
exports.BitbucketRemote = BitbucketRemote;
//# sourceMappingURL=bitbucket.js.map