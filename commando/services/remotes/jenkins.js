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
var connection_1 = require("../connection");
var JenkinsRemote = (function (_super) {
    __extends(JenkinsRemote, _super);
    function JenkinsRemote() {
        _super.apply(this, arguments);
        this.usesExtra = false;
    }
    JenkinsRemote.prototype.getAuthMethods = function () { return [connection_1.AuthMethod.basic, connection_1.AuthMethod.oauth2, connection_1.AuthMethod.oauth]; };
    JenkinsRemote.prototype.init = function () {
        _.merge(this.defaultRequestOptions, {
            baseUrl: this.connection.extra,
            auth: { username: this.connection.key, password: this.connection.secret }
        });
    };
    JenkinsRemote = __decorate([
        connection_remote_1.remote('jenkins', 'Jenkins'), 
        __metadata('design:paramtypes', [])
    ], JenkinsRemote);
    return JenkinsRemote;
}(connection_remote_1.Remote));
exports.JenkinsRemote = JenkinsRemote;
//# sourceMappingURL=jenkins.js.map