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
var connection_remote_1 = require("../connection.remote");
var BB = require("bluebird");
var connection_1 = require("../connection");
var GithubRemote = (function (_super) {
    __extends(GithubRemote, _super);
    function GithubRemote() {
        _super.apply(this, arguments);
        this.usesExtra = false;
        this.authMethods = [connection_1.AuthMethod.basic, connection_1.AuthMethod.oauth, connection_1.AuthMethod.token];
    }
    GithubRemote.prototype.init = function () {
        _.merge(this.defaultRequestOptions, {
            baseUrl: 'https://api.github.com/',
            auth: { username: this.connection.key, password: this.connection.secret },
            headers: {
                'User-Agent': 'Commando',
            }
        });
    };
    GithubRemote.prototype.deleteRepository = function (owner, repo) {
        return this.delete("repos/" + owner + "/" + repo);
    };
    GithubRemote.prototype.getUserTeams = function (username) {
        return this.get("users/" + username + "/orgs").then(function (data) {
            return data;
        });
    };
    GithubRemote.prototype.getUserRepositories = function (username) {
        return this.get("users/" + username + "/repos").then(function (data) {
            var defer = BB.defer();
            defer.resolve(data);
            return defer.promise;
        });
    };
    GithubRemote = __decorate([
        connection_remote_1.remote('github', 'Github'), 
        __metadata('design:paramtypes', [])
    ], GithubRemote);
    return GithubRemote;
}(connection_remote_1.Remote));
exports.GithubRemote = GithubRemote;
//# sourceMappingURL=github.js.map