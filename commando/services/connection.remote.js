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
var util_1 = require("@radic/util");
var _ = require("lodash");
var core_1 = require("../core");
var rp = require("request-promise");
var errors_1 = require("request-promise/errors");
exports.StatusCodeError = errors_1.StatusCodeError;
var AuthMethod = (function (_super) {
    __extends(AuthMethod, _super);
    function AuthMethod() {
        _super.apply(this, arguments);
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
    AuthMethod.basic = new AuthMethod('basic');
    AuthMethod.oauth = new AuthMethod('oauth');
    AuthMethod.oauth2 = new AuthMethod('oauth2');
    AuthMethod.token = new AuthMethod('token');
    return AuthMethod;
}(util_1.StringType));
exports.AuthMethod = AuthMethod;
var RemoteFactory = (function () {
    function RemoteFactory() {
        this.remotes = {};
    }
    RemoteFactory.prototype.register = function (name, cls) {
        this.remotes[name] = cls;
    };
    RemoteFactory.prototype.create = function (name, connection) {
        var reg = this.get(name);
        var remote = core_1.kernel.build(reg.cls);
        remote.connection = connection;
        remote.name = reg.name;
        remote.prettyName = reg.prettyName;
        remote.callInit();
        return remote;
    };
    RemoteFactory.prototype.has = function (name) {
        return this.remotes[name] !== undefined;
    };
    RemoteFactory.prototype.get = function (name) {
        return this.remotes[name];
    };
    RemoteFactory.prototype.names = function () {
        return Object.keys(this.remotes);
    };
    RemoteFactory.prototype.all = function () {
        return _.values(this.remotes);
    };
    RemoteFactory = __decorate([
        core_1.provideSingleton(core_1.COMMANDO.REMOTES), 
        __metadata('design:paramtypes', [])
    ], RemoteFactory);
    return RemoteFactory;
}());
exports.RemoteFactory = RemoteFactory;
function remote(name, prettyName, type) {
    if (type === void 0) { type = 0; }
    return function (cls) {
        core_1.kernel.get(core_1.COMMANDO.REMOTES).register(name, { name: name, prettyName: prettyName, cls: cls, type: type });
    };
}
exports.remote = remote;
var Remote = (function () {
    function Remote() {
        this.hasExtra = false;
        this.inited = false;
        this.defaultRequestOptions = {
            baseUrl: '',
            uri: '',
            auth: {
                user: null,
                password: null
            },
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            json: true
        };
    }
    Remote.prototype.callInit = function () {
        if (this.inited)
            return false;
        this.inited = true;
        this.init();
    };
    Remote.prototype.validate = function () {
        return true;
    };
    Remote.prototype.request = function (options) {
        options = _.merge(this.defaultRequestOptions, options);
        var request = rp(options);
        return request;
    };
    Remote.prototype.get = function (endpoint, params) {
        if (params === void 0) { params = {}; }
        return this.request({ uri: endpoint, qs: params });
    };
    Remote.prototype.put = function (endpoint, payload) {
        if (payload === void 0) { payload = {}; }
        return this.request({ method: 'PUT', uri: endpoint, body: payload, json: true });
    };
    Remote.prototype.patch = function (endpoint, payload) {
        if (payload === void 0) { payload = {}; }
        return this.request({ method: 'PATCH', uri: endpoint, body: payload, json: true });
    };
    Remote.prototype.post = function (endpoint, payload) {
        if (payload === void 0) { payload = {}; }
        return this.request({ method: 'POST', uri: endpoint, body: payload, json: true });
    };
    Remote.prototype.delete = function (endpoint, params) {
        if (params === void 0) { params = {}; }
        return this.request({ method: 'DELETE', uri: endpoint, qs: params });
    };
    Remote = __decorate([
        core_1.injectable(), 
        __metadata('design:paramtypes', [])
    ], Remote);
    return Remote;
}());
exports.Remote = Remote;
var RemoteExtra = (function () {
    function RemoteExtra() {
    }
    Object.defineProperty(RemoteExtra.prototype, "name", {
        get: function () { },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RemoteExtra.prototype, "prettyName", {
        get: function () { },
        enumerable: true,
        configurable: true
    });
    RemoteExtra.prototype.validate = function (extra) {
        return true;
    };
    RemoteExtra.prototype.parse = function (extra) {
        return extra;
    };
    RemoteExtra.prototype.ask = function (cb) {
    };
    return RemoteExtra;
}());
exports.RemoteExtra = RemoteExtra;
//# sourceMappingURL=connection.remote.js.map