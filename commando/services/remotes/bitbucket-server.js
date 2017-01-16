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
class BitbucketServerExtra extends remote_1.RemoteExtra {
    getName() { return 'url'; }
    getPrettyName() { return 'Bitbucket Server Base URL'; }
}
exports.BitbucketServerExtra = BitbucketServerExtra;
let BitbucketServerRemote = class BitbucketServerRemote extends remote_1.GitRestRemote {
    constructor() {
        super(...arguments);
        this.usesExtra = true;
        this.extraDefinition = new BitbucketServerExtra();
    }
    getMirrorUrl(owner, repo) {
        return this.defaultRequestOptions.baseUrl.replace('rest/api/1.0', '') + `/${owner}/${repo}`;
    }
    getAuthMethods() { return [remote_1.AuthMethod.basic, remote_1.AuthMethod.oauth2, remote_1.AuthMethod.oauth]; }
    init() {
        let url = this.connection.extra.url;
        if (!url.endsWith('/'))
            url += '/';
        url += 'rest/api/1.0';
        this.mergeDefaults({
            baseUrl: url,
            auth: { username: this.connection.key, password: this.connection.secret }
        });
    }
    getUserRepositories(username) {
        return undefined;
    }
    getUserTeams(username, opts = {}) {
        return this.get('projects', _.merge({ pagelen: 100 }, opts)).then((res) => {
            return new Promise((resolve, reject) => {
                resolve(Object.keys(_.keyBy(res.values, 'key')));
            });
        });
    }
    deleteRepository(owner, repo) {
        return this.delete(`projects/${owner}/repos/${repo}`);
    }
    createRepository(owner, repo, opts) {
        return this.post(`projects/${owner}/repos`, _.merge({ name: repo }, opts));
    }
    getRepositories(owner) {
        return undefined;
    }
    getRepository(owner, repo) {
        return undefined;
    }
    getUser(username) {
        return undefined;
    }
    getTeam(team) {
        return undefined;
    }
    getTeamRepositories(team) {
        return undefined;
    }
};
BitbucketServerRemote = __decorate([
    remote_1.remote('bitbucket_server', 'Bitbucket Server', 'git'), 
    __metadata('design:paramtypes', [])
], BitbucketServerRemote);
exports.BitbucketServerRemote = BitbucketServerRemote;
//# sourceMappingURL=bitbucket-server.js.map