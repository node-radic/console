"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var _ = require("lodash");
var util_1 = require("@radic/util");
var AuthMethod = (function (_super) {
    __extends(AuthMethod, _super);
    function AuthMethod() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AuthMethod.getKeyName = function (method) {
        return AuthMethod.getName(method, true);
    };
    AuthMethod.getSecretName = function (method) {
        return AuthMethod.getName(method, false);
    };
    AuthMethod.prototype.equals = function (method) {
        if (typeof method === 'string') {
            return this.value === method;
        }
        if (method instanceof AuthMethod) {
            return this.value === method.value;
        }
        return false;
    };
    AuthMethod.getName = function (method, key) {
        if (key === void 0) { key = true; }
        switch (true) {
            case method == AuthMethod.basic:
                return key ? 'username' : 'password';
            case method == AuthMethod.oauth:
                return key ? 'key' : 'secret';
            case method == AuthMethod.oauth2:
                return key ? 'id' : 'secret';
            case method == AuthMethod.token:
                return key ? 'username' : 'token';
            case method == AuthMethod.key:
                return key ? 'username' : 'keyfile';
        }
    };
    Object.defineProperty(AuthMethod.prototype, "name", {
        get: function () {
            return this.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AuthMethod.prototype, "keyName", {
        get: function () {
            return AuthMethod.getKeyName(AuthMethod[this.value]);
        },
        enumerable: true,
        configurable: true
    });
    return AuthMethod;
}(util_1.StringType));
AuthMethod.basic = new AuthMethod('basic');
AuthMethod.oauth = new AuthMethod('oauth');
AuthMethod.oauth2 = new AuthMethod('oauth2');
AuthMethod.token = new AuthMethod('token');
AuthMethod.key = new AuthMethod('key');
exports.AuthMethod = AuthMethod;
var AbstractGitRestClient = (function () {
    function AbstractGitRestClient() {
        this.client = this.createClient();
    }
    AbstractGitRestClient.prototype.createClient = function (config) {
        if (config === void 0) { config = {}; }
        config = _.merge({
            baseUrl: '',
            timeout: 1000,
            headers: {}
        }, config);
        return axios_1.default.create(config);
    };
    AbstractGitRestClient.prototype.configure = function (config) {
        this.config = _.merge(this.config, config);
        this.client = this.createClient(this.config);
    };
    AbstractGitRestClient.prototype.setAuth = function (method, loginId, loginAuth) {
        switch (method) {
            case AuthMethod.basic:
                this.configure({ auth: { username: loginId, password: loginAuth } });
                break;
            case AuthMethod.oauth2:
        }
    };
    return AbstractGitRestClient;
}());
exports.AbstractGitRestClient = AbstractGitRestClient;
var GithubRestClient = (function (_super) {
    __extends(GithubRestClient, _super);
    function GithubRestClient() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GithubRestClient.prototype.getAuthMethods = function () {
        return [AuthMethod.basic, AuthMethod.token];
    };
    return GithubRestClient;
}(AbstractGitRestClient));
exports.GithubRestClient = GithubRestClient;
var Rest = (function () {
    function Rest() {
    }
    return Rest;
}());
exports.Rest = Rest;
//# sourceMappingURL=index.js.map