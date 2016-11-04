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
const remote_1 = require("../remote");
class JiraExtra extends remote_1.RemoteExtra {
    constructor(...args) {
        super(...args);
        this.name = 'url';
        this.prettyName = 'Jira Server Base URL';
    }
    getName() {
        return 'url';
    }
    getPrettyName() {
        return 'URL';
    }
}
exports.JiraExtra = JiraExtra;
let JiraRemote = class JiraRemote extends remote_1.RestRemote {
    constructor(...args) {
        super(...args);
        this.usesExtra = false;
    }
    getAuthMethods() { return [remote_1.AuthMethod.basic, remote_1.AuthMethod.oauth2, remote_1.AuthMethod.oauth]; }
    init() {
        this.mergeDefaults({
            baseUrl: this.connection.extra,
            auth: { username: this.connection.key, password: this.connection.secret }
        });
    }
};
JiraRemote = __decorate([
    remote_1.remote('jira', 'Jira'), 
    __metadata('design:paramtypes', [])
], JiraRemote);
exports.JiraRemote = JiraRemote;
//# sourceMappingURL=jira.js.map