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
var database_1 = require("./database");
var request_promise_1 = require("request-promise");
exports.RequestPromise = request_promise_1.RequestPromise;
exports.RequestOptions = request_promise_1.Options;
var errors_1 = require("request-promise/errors");
exports.StatusCodeError = errors_1.StatusCodeError;
var Connection = (function (_super) {
    __extends(Connection, _super);
    function Connection(data) {
        _super.call(this, data);
        this.fields = {
            id: 'number',
            name: 'string',
            auth: 'string',
            method: 'string',
            key: 'string',
            secret: 'string',
            extra: 'object'
        };
    }
    Connection.prototype.fill = function (data) {
        var _this = this;
        Object.keys(this.fields).forEach(function (fieldName) {
            if (data[fieldName]) {
                var setterMethod = 'set' + _.upperFirst(fieldName);
                if (_this[setterMethod]) {
                    return _this[setterMethod](data[fieldName]);
                }
                _this[fieldName] = data[fieldName];
            }
        });
    };
    Connection.create = function (data) {
        return new Connection(data);
    };
    __decorate([
        core_1.inject(core_1.COMMANDO.AUTH), 
        __metadata('design:type', Object)
    ], Connection.prototype, "auth", void 0);
    Connection = __decorate([
        core_1.provide(core_1.COMMANDO.CONNECTION), 
        __metadata('design:paramtypes', [Object])
    ], Connection);
    return Connection;
}(database_1.Model));
exports.Connection = Connection;
var ConnectionRepository = (function (_super) {
    __extends(ConnectionRepository, _super);
    function ConnectionRepository() {
        _super.apply(this, arguments);
        this.table = 'connections';
    }
    ConnectionRepository.prototype.createModel = function () {
        return core_1.kernel.build(core_1.COMMANDO.CONNECTION);
    };
    ConnectionRepository.prototype.add = function (data) {
        data.id = this.getCountRecords();
        this.query.push(data).value();
    };
    ConnectionRepository.prototype.getCountRecords = function () {
        return parseInt(this.query.size().value());
    };
    ConnectionRepository = __decorate([
        core_1.provideSingleton(core_1.COMMANDO.CONNECTIONS), 
        __metadata('design:paramtypes', [])
    ], ConnectionRepository);
    return ConnectionRepository;
}(database_1.Repository));
exports.ConnectionRepository = ConnectionRepository;
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
            return AuthMethod.getKeyName(AuthMethod.methods[this.value]);
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
var Auth = (function () {
    function Auth() {
        this.method = AuthMethod.basic;
    }
    Auth = __decorate([
        core_1.provide(core_1.COMMANDO.AUTH), 
        __metadata('design:paramtypes', [])
    ], Auth);
    return Auth;
}());
var AuthFactory = (function () {
    function AuthFactory() {
    }
    AuthFactory.prototype.create = function (remote, method, key, secret) {
    };
    AuthFactory = __decorate([
        core_1.provideSingleton(core_1.COMMANDO.AUTHS), 
        __metadata('design:paramtypes', [])
    ], AuthFactory);
    return AuthFactory;
}());
var RemoteFactory = (function () {
    function RemoteFactory() {
        this.remotes = {};
    }
    RemoteFactory.prototype.register = function (name, cls) {
        this.remotes[name] = cls;
    };
    RemoteFactory.prototype.create = function (name) {
        var cls = this.get(name);
        return core_1.kernel.build(cls);
    };
    RemoteFactory.prototype.has = function (name) {
        return this.remotes[name] !== undefined;
    };
    RemoteFactory.prototype.get = function (name) {
        return this.remotes[name];
    };
    RemoteFactory = __decorate([
        core_1.provideSingleton(core_1.COMMANDO.REMOTES), 
        __metadata('design:paramtypes', [])
    ], RemoteFactory);
    return RemoteFactory;
}());
function remote(name) {
    return function (cls) {
        core_1.kernel.get(core_1.COMMANDO.REMOTES).register(name, cls);
    };
}
var Remote = (function () {
    function Remote() {
    }
    Object.defineProperty(Remote.prototype, "authMethods", {
        get: function () { },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Remote.prototype, "usesExtraField", {
        get: function () { },
        enumerable: true,
        configurable: true
    });
    return Remote;
}());
var GithubRemote = (function (_super) {
    __extends(GithubRemote, _super);
    function GithubRemote() {
        _super.apply(this, arguments);
        this.usesExtraField = false;
        this.authMethods = [AuthMethod.basic, AuthMethod.oauth];
    }
    return GithubRemote;
}(Remote));
//# sourceMappingURL=connections.js.map