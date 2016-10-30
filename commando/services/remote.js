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
const util_1 = require("@radic/util");
const _ = require("lodash");
const core_1 = require("../core");
const rp = require("request-promise");
var errors_1 = require("request-promise/errors");
exports.StatusCodeError = errors_1.StatusCodeError;
class AuthMethod extends util_1.StringType {
    static getKeyName(method) {
        return AuthMethod.getName(method, true);
    }
    static getSecretName(method) {
        return AuthMethod.getName(method, false);
    }
    equals(method) {
        if (typeof method === 'string') {
            return this.value === method;
        }
        if (method instanceof AuthMethod) {
            return this.value === method.value;
        }
        return false;
    }
    static getName(method, key = true) {
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
    }
    get name() {
        return this.value;
    }
    get keyName() {
        return AuthMethod.getKeyName(AuthMethod[this.value]);
    }
}
AuthMethod.basic = new AuthMethod('basic');
AuthMethod.oauth = new AuthMethod('oauth');
AuthMethod.oauth2 = new AuthMethod('oauth2');
AuthMethod.token = new AuthMethod('token');
AuthMethod.key = new AuthMethod('key');
exports.AuthMethod = AuthMethod;
let Remote = class Remote {
    constructor() {
        this.hasExtra = false;
        this.inited = false;
    }
    callInit() {
        if (this.inited)
            return false;
        this.inited = true;
        this.init();
    }
    validate() {
        return true;
    }
};
Remote = __decorate([
    core_1.injectable(), 
    __metadata('design:paramtypes', [])
], Remote);
exports.Remote = Remote;
let RestRemote = class RestRemote extends Remote {
    constructor() {
        super();
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
    mergeDefaults(options) {
        this.defaultRequestOptions = _.merge(this.defaultRequestOptions, options);
    }
    request(options) {
        options = _.merge(this.defaultRequestOptions, options);
        var request = rp(options);
        return request;
    }
    get(endpoint, params = {}) {
        return this.request({ uri: endpoint, qs: params });
    }
    put(endpoint, payload = {}) {
        return this.request({ method: 'PUT', uri: endpoint, body: payload, json: true });
    }
    patch(endpoint, payload = {}) {
        return this.request({ method: 'PATCH', uri: endpoint, body: payload, json: true });
    }
    post(endpoint, payload = {}) {
        return this.request({ method: 'POST', uri: endpoint, body: payload, json: true });
    }
    delete(endpoint, params = {}) {
        return this.request({ method: 'DELETE', uri: endpoint, qs: params });
    }
};
RestRemote = __decorate([
    core_1.injectable(), 
    __metadata('design:paramtypes', [])
], RestRemote);
exports.RestRemote = RestRemote;
let GitRestRemote = class GitRestRemote extends RestRemote {
};
GitRestRemote = __decorate([
    core_1.injectable(), 
    __metadata('design:paramtypes', [])
], GitRestRemote);
exports.GitRestRemote = GitRestRemote;
let RemoteExtra = class RemoteExtra {
    validate(extra) {
        return true;
    }
    parse(extra) {
        return extra;
    }
    ask(cb) {
    }
};
RemoteExtra = __decorate([
    core_1.injectable(), 
    __metadata('design:paramtypes', [])
], RemoteExtra);
exports.RemoteExtra = RemoteExtra;
let RemoteFactory = class RemoteFactory {
    constructor() {
        this.remotes = {};
    }
    register(name, cls) {
        this.remotes[name] = cls;
    }
    create(name, connection) {
        let reg = this.get(name);
        let remote = core_1.kernel.build(reg.cls);
        remote.connection = connection;
        remote.name = reg.name;
        remote.prettyName = reg.prettyName;
        remote.type = reg.type;
        remote.callInit();
        return remote;
    }
    has(name) {
        return this.remotes[name] !== undefined;
    }
    get(name) {
        return this.remotes[name];
    }
    keys() {
        return Object.keys(this.remotes);
    }
    values() {
        return _.values(this.remotes);
    }
};
RemoteFactory = __decorate([
    core_1.provideSingleton(core_1.COMMANDO.REMOTES), 
    __metadata('design:paramtypes', [])
], RemoteFactory);
exports.RemoteFactory = RemoteFactory;
function remote(name, prettyName, type = 'generic') {
    return (cls) => {
        core_1.kernel.get(core_1.COMMANDO.REMOTES).register(name, { name, prettyName, cls, type });
    };
}
exports.remote = remote;
//# sourceMappingURL=remote.js.map