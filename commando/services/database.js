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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var Cryptr = require("cryptr");
var fs_1 = require("fs");
var util_1 = require("@radic/util");
var core_1 = require("../core");
var Database = (function () {
    function Database(paths, keys) {
        var _this = this;
        this.paths = paths;
        this.keys = keys;
        this.cryptr = new Cryptr(this.keys.public);
        this._db = require('lowdb')(this.paths.userDatabase, {
            format: {
                deserialize: function (str) {
                    var decrypted = _this.cryptr.decrypt(str);
                    var obj = JSON.parse(decrypted);
                    return obj;
                },
                serialize: function (obj) {
                    var str = JSON.stringify(obj);
                    var encrypted = _this.cryptr.encrypt(str);
                    return encrypted;
                }
            }
        });
        this._db.defaults({
            connections: [],
            auths: []
        }).value();
    }
    Database.prototype.getDB = function () {
        return this._db;
    };
    Database.prototype.rawDB = function () {
        var str = fs_1.readFileSync(this.paths.userDatabase);
        var decrypted = this.cryptr.decrypt(str);
        var obj = JSON.parse(decrypted);
        return obj;
    };
    Database.prototype.get = function (name) {
        return this._db.get(name);
    };
    Database.prototype.has = function (name) {
        return this._db.has(name).value();
    };
    Database.prototype.raw = function () {
        return this.rawDB();
    };
    Database.prototype.asConfig = function () {
        new util_1.Config(this.rawDB());
    };
    Database = __decorate([
        core_1.provideSingleton(core_1.COMMANDO.DATABASE),
        __param(0, core_1.inject(core_1.COMMANDO.PATHS)),
        __param(1, core_1.inject(core_1.COMMANDO.KEYS)), 
        __metadata('design:paramtypes', [Object, Object])
    ], Database);
    return Database;
}());
exports.Database = Database;
var Model = (function () {
    function Model(data) {
    }
    Model = __decorate([
        core_1.injectable(), 
        __metadata('design:paramtypes', [Object])
    ], Model);
    return Model;
}());
exports.Model = Model;
var Repository = (function () {
    function Repository() {
    }
    Object.defineProperty(Repository.prototype, "table", {
        get: function () { },
        set: function (val) { },
        enumerable: true,
        configurable: true
    });
    Repository.prototype.find = function (id) {
        return this.query.find({ id: id }).value();
    };
    __decorate([
        core_1.inject(core_1.COMMANDO.DATABASE), 
        __metadata('design:type', Database)
    ], Repository.prototype, "database", void 0);
    Repository = __decorate([
        core_1.injectable(), 
        __metadata('design:paramtypes', [])
    ], Repository);
    return Repository;
}());
exports.Repository = Repository;
//# sourceMappingURL=database.js.map