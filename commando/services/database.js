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
var _ = require("lodash");
var fs_1 = require("fs");
var util_1 = require("@radic/util");
var core_1 = require("../core");
var src_1 = require("../../src");
var Validation = require("validatorjs");
var fs_extra_1 = require("fs-extra");
var path_1 = require("path");
var moment = require('moment');
var globule = require("globule");
var path_2 = require("path");
Validation.register('object', function (value, req, attr) {
    console.log('validate object: ', 'value', value, 'req', req, 'attr', attr);
    console.log('validate object: kindOf(value) === "object"', util_1.kindOf(value) === 'object');
    return util_1.kindOf(value) === 'object';
});
Validation.register('unique', function (value, model, column) {
    console.log('validate unique: ', 'value', value, 'model', model, 'column', column);
    var find = {};
    find[column] = value;
    return false;
});
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
            connections: []
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
    Database.prototype.drop = function () {
        this.setState({});
        return this;
    };
    Database.prototype.getState = function () {
        return this._db.getState();
    };
    Database.prototype.setState = function (state) {
        this._db.setState(state);
        return this;
    };
    Database.prototype.write = function (source) {
        this._db.read(source);
        return this;
    };
    Database.prototype.read = function (source) {
        this._db.read(source);
        return this;
    };
    Database.prototype.backup = function (backupPath) {
        backupPath = backupPath || path_1.resolve(core_1.paths.dbBackups, moment().format('Y/M/D/HH-mm-ss.[db]'));
        fs_extra_1.copySync(core_1.paths.userDatabase, backupPath);
        return backupPath;
    };
    Database.prototype.listBackups = function () {
        return globule.find(path_2.join(core_1.paths.dbBackups, '**/*.db'));
    };
    Database.prototype.restore = function (restorePath) {
        this.write(path_1.resolve(restorePath));
        return this;
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
var models = {};
function model(id, info) {
    return function (cls) {
        info = _.merge({
            id: id,
            cls: cls,
            columns: {},
            key: {
                name: 'id',
                type: 'integer',
                auto: true
            }
        }, info);
        models[id] = info;
    };
}
exports.model = model;
function getModel(modelId) {
    if (!models[modelId])
        throw Error('Model does not exist:' + modelId);
    var reg = models[modelId];
    var model = src_1.kernel.build(reg.cls);
    model._modelId = modelId;
    return model;
}
exports.getModel = getModel;
var Model = (function () {
    function Model() {
    }
    Object.defineProperty(Model.prototype, "_registration", {
        get: function () {
            var reg = _.find(models, { id: this._modelId });
            var a = 'a';
            return reg;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "_rules", {
        get: function () {
            var rules = _.clone(this._registration.columns);
            this._fields.forEach(function (name) {
                if (rules[name] === '' || rules[name] === null) {
                    delete rules[name];
                }
            });
            return rules;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "_fields", {
        get: function () { return Object.keys(this._registration.columns); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "_table", {
        get: function () { return this._registration.table; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Model.prototype, "_key", {
        get: function () { return this._registration.key; },
        enumerable: true,
        configurable: true
    });
    Model.prototype.getDB = function () {
        return this._database;
    };
    Model.prototype.query = function () {
        return this._query ? this._query : this._query = this.getDB().get(this._table);
    };
    Model.prototype.fill = function (data) {
        _.assignIn(this, _.pick(data, this._fields));
        return this;
    };
    Model.prototype.serialize = function () {
        return _.pick(this, this._fields);
    };
    Object.defineProperty(Model.prototype, "querySelf", {
        get: function () {
            var find = {};
            find[this._key.name] = this[this._key.name];
            return find;
        },
        enumerable: true,
        configurable: true
    });
    Model.prototype.save = function () {
        var find = {};
        find[this._key.name] = this[this._key.name];
        this.query().find(find);
        this.query().push(this.serialize()).value();
    };
    Model.prototype.validate = function () {
        return new Validation(this.serialize(), this._registration.columns);
    };
    Model.prototype.update = function () {
        this.query().find(this.querySelf).assign(this.serialize()).value();
    };
    Model.prototype.delete = function () {
        this.query().remove(this.querySelf).value();
    };
    __decorate([
        core_1.inject(core_1.COMMANDO.DATABASE), 
        __metadata('design:type', Database)
    ], Model.prototype, "_database", void 0);
    Model = __decorate([
        core_1.injectable(), 
        __metadata('design:paramtypes', [])
    ], Model);
    return Model;
}());
exports.Model = Model;
var Repository = (function () {
    function Repository() {
    }
    Repository.prototype.model = function (data) {
        var model = getModel(this.getModelID());
        if (data)
            model.fill(data);
        return model;
    };
    Object.defineProperty(Repository.prototype, "table", {
        get: function () {
            return this._table ? this._table : this._table = this.model()._table;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Repository.prototype, "key", {
        get: function () {
            return this._key ? this._key : this._key = this.model()._key;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Repository.prototype, "query", {
        get: function () {
            return this._query ? this._query : this._query = this.db.get(this.table);
        },
        enumerable: true,
        configurable: true
    });
    Repository.prototype.has = function (name) {
        return this.get(name) !== undefined;
    };
    Repository.prototype.get = function (name) {
        return this.findBy(this.key.name, name);
    };
    Repository.prototype.all = function () {
        var _this = this;
        var all = this.query.value();
        if (all.length > 0)
            return all.map(function (data) { return _this.model(data); });
        return [];
    };
    Repository.prototype.find = function (keyValue) {
        var find = {};
        find[this.key.name] = keyValue;
        return this.query.find(find).value();
    };
    Repository.prototype.findBy = function (key, value) {
        var find = {};
        find[key] = value;
        return this.query.find(find).value();
    };
    Repository.prototype.filter = function (filter) {
        if (filter === void 0) { filter = {}; }
        return this.query.filter(filter).value();
    };
    Repository.prototype.count = function () {
        return parseInt(this.query.size().value());
    };
    __decorate([
        core_1.inject(core_1.COMMANDO.DATABASE), 
        __metadata('design:type', Database)
    ], Repository.prototype, "db", void 0);
    Repository = __decorate([
        core_1.injectable(), 
        __metadata('design:paramtypes', [])
    ], Repository);
    return Repository;
}());
exports.Repository = Repository;
//# sourceMappingURL=database.js.map