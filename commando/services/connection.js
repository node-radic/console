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
var core_1 = require("../core");
var database_1 = require("./database");
var connection_remote_1 = require("./connection.remote");
var Connection = (function (_super) {
    __extends(Connection, _super);
    function Connection() {
        _super.apply(this, arguments);
        this._extra = '{}';
    }
    Object.defineProperty(Connection.prototype, "extra", {
        get: function () { return JSON.parse(this._extra); },
        set: function (val) { this._extra = JSON.stringify(val); },
        enumerable: true,
        configurable: true
    });
    Connection.prototype.getMethod = function () {
        return connection_remote_1.AuthMethod[this.method];
    };
    Connection.prototype.getRemote = function () {
        return this.remotes.create(this.remote, this);
    };
    __decorate([
        core_1.inject(core_1.COMMANDO.REMOTES), 
        __metadata('design:type', connection_remote_1.RemoteFactory)
    ], Connection.prototype, "remotes", void 0);
    __decorate([
        core_1.inject(core_1.COMMANDO.CONNECTIONS), 
        __metadata('design:type', ConnectionRepository)
    ], Connection.prototype, "repository", void 0);
    Connection = __decorate([
        database_1.model('connection', {
            table: 'connections',
            fields: ['name', 'method', 'remote', 'key', 'secret', 'extra'],
            key: {
                name: 'name',
                type: 'string',
                auto: true
            }
        }),
        core_1.provide(core_1.COMMANDO.CONNECTION), 
        __metadata('design:paramtypes', [])
    ], Connection);
    return Connection;
}(database_1.Model));
exports.Connection = Connection;
var ConnectionRepository = (function (_super) {
    __extends(ConnectionRepository, _super);
    function ConnectionRepository() {
        _super.apply(this, arguments);
    }
    ConnectionRepository.prototype.getModelID = function () { return 'connection'; };
    ConnectionRepository = __decorate([
        core_1.provideSingleton(core_1.COMMANDO.CONNECTIONS), 
        __metadata('design:paramtypes', [])
    ], ConnectionRepository);
    return ConnectionRepository;
}(database_1.Repository));
exports.ConnectionRepository = ConnectionRepository;
//# sourceMappingURL=connection.js.map