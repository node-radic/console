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
const core_1 = require("../core");
const database_1 = require("./database");
const remote_1 = require("./remote");
let ConnectionRepository = class ConnectionRepository extends database_1.Repository {
    getModelID() { return 'connection'; }
};
ConnectionRepository = __decorate([
    core_1.provideSingleton(core_1.COMMANDO.CONNECTIONS), 
    __metadata('design:paramtypes', [])
], ConnectionRepository);
exports.ConnectionRepository = ConnectionRepository;
let Connection = class Connection extends database_1.Model {
    constructor(...args) {
        super(...args);
        this._extra = '{}';
    }
    get extra() { return JSON.parse(this._extra); }
    set extra(val) { this._extra = JSON.stringify(val); }
    getMethod() {
        return remote_1.AuthMethod[this.method];
    }
    getRemote() {
        return this.remotes.create(this.remote, this);
    }
    get type() {
        if (!this.remote)
            return undefined;
        return this.getRemote().type;
    }
    set type(val) {
    }
};
__decorate([
    core_1.inject(core_1.COMMANDO.REMOTES), 
    __metadata('design:type', remote_1.RemoteFactory)
], Connection.prototype, "remotes", void 0);
__decorate([
    core_1.inject(core_1.COMMANDO.CONNECTIONS), 
    __metadata('design:type', ConnectionRepository)
], Connection.prototype, "repository", void 0);
Connection = __decorate([
    database_1.model('connection', {
        table: 'connections',
        columns: {
            name: 'unique:connection',
            method: 'required',
            remote: 'required',
            key: 'required',
            type: 'required string',
            secret: 'string',
            extra: 'object'
        },
        key: {
            name: 'name',
            type: 'string',
            auto: true
        }
    }),
    core_1.provide(core_1.COMMANDO.CONNECTION), 
    __metadata('design:paramtypes', [])
], Connection);
exports.Connection = Connection;
//# sourceMappingURL=connection.js.map