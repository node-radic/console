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
var _ = require('lodash');
var connection_remote_1 = require("../connection.remote");
var connection_1 = require("../connection");
var JiraExtra = (function (_super) {
    __extends(JiraExtra, _super);
    function JiraExtra() {
        _super.apply(this, arguments);
        this.name = 'url';
        this.prettyName = 'Jira Server Base URL';
    }
    return JiraExtra;
}(connection_remote_1.RemoteExtra));
exports.JiraExtra = JiraExtra;
var JiraRemote = (function (_super) {
    __extends(JiraRemote, _super);
    function JiraRemote() {
        _super.apply(this, arguments);
        this.usesExtra = false;
    }
    JiraRemote.prototype.getAuthMethods = function () { return [connection_1.AuthMethod.basic, connection_1.AuthMethod.oauth2, connection_1.AuthMethod.oauth]; };
    JiraRemote.prototype.init = function () {
        _.merge(this.defaultRequestOptions, {
            baseUrl: this.connection.extra,
            auth: { username: this.connection.key, password: this.connection.secret }
        });
    };
    JiraRemote = __decorate([
        connection_remote_1.remote('jira', 'Jira'), 
        __metadata('design:paramtypes', [])
    ], JiraRemote);
    return JiraRemote;
}(connection_remote_1.Remote));
exports.JiraRemote = JiraRemote;
//# sourceMappingURL=jira.js.map