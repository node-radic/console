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
const Cryptr = require("cryptr");
const _ = require("lodash");
const fs_1 = require("fs");
const util_1 = require("@radic/util");
const core_1 = require("../core");
const src_1 = require("../../src");
const Validation = require("validatorjs");
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const moment = require('moment');
const globule = require("globule");
const path_2 = require("path");
let models = {};
Validation.register('object', (value, req, attr) => {
    console.log('validate object: ', 'value', value, 'req', req, 'attr', attr);
    console.log('validate object: kindOf(value) === "object"', util_1.kindOf(value) === 'object');
    return util_1.kindOf(value) === 'object';
});
Validation.register('unique', (value, model, column) => {
    console.log('validate unique: ', 'value', value, 'model', model, 'column', column);
    let find = {};
    find[column] = value;
    return false;
});
let Database = class Database {
    constructor(paths, keys, config) {
        this.paths = paths;
        this.keys = keys;
        this.config = config;
        this.cryptr = new Cryptr(this.keys.public);
        this._db = require('lowdb')(this.paths.userDatabase, {
            format: {
                deserialize: (str) => {
                    const decrypted = this.cryptr.decrypt(str);
                    const obj = JSON.parse(decrypted);
                    if (this.config('debug') === true) {
                        fs_extra_1.writeJsonSync(this.paths.userDatabase + '.debug.json', obj);
                    }
                    return obj;
                },
                serialize: (obj) => {
                    const str = JSON.stringify(obj);
                    const encrypted = this.cryptr.encrypt(str);
                    return encrypted;
                }
            }
        });
        this._db.defaults({
            connections: []
        }).value();
    }
    getDB() {
        return this._db;
    }
    rawDB() {
        let str = fs_1.readFileSync(this.paths.userDatabase);
        const decrypted = this.cryptr.decrypt(str);
        const obj = JSON.parse(decrypted);
        return obj;
    }
    get(name) {
        return this._db.get(name);
    }
    has(name) {
        return this._db.has(name).value();
    }
    raw() {
        return this.rawDB();
    }
    asConfig() {
        new util_1.Config(this.rawDB());
    }
    drop() {
        this.setState({});
        return this;
    }
    getState() {
        return this._db.getState();
    }
    setState(state) {
        this._db.setState(state);
        return this;
    }
    write(source) {
        this._db.read(source);
        return this;
    }
    read(source) {
        this._db.read(source);
        return this;
    }
    backup(backupPath) {
        backupPath = backupPath || path_1.resolve(core_1.paths.dbBackups, moment().format('Y/M/D/HH-mm-ss.[db]'));
        fs_extra_1.copySync(core_1.paths.userDatabase, backupPath);
        return backupPath;
    }
    listBackups() {
        return globule.find(path_2.join(core_1.paths.dbBackups, '**/*.db'));
    }
    restore(restorePath) {
        this.write(path_1.resolve(restorePath));
        return this;
    }
    getModels() {
        return models;
    }
};
Database = __decorate([
    core_1.provideSingleton(core_1.COMMANDO.DATABASE),
    __param(0, core_1.inject(core_1.COMMANDO.PATHS)),
    __param(1, core_1.inject(core_1.COMMANDO.KEYS)),
    __param(2, core_1.inject(core_1.COMMANDO.CONFIG)), 
    __metadata('design:paramtypes', [Object, Object, Function])
], Database);
exports.Database = Database;
function model(id, info) {
    return (cls) => {
        info = _.merge({
            id,
            cls,
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
    let reg = models[modelId];
    let model = src_1.kernel.build(reg.cls);
    model._modelId = modelId;
    return model;
}
exports.getModel = getModel;
let Model = class Model {
    get _registration() {
        return models[this._modelId];
    }
    get _rules() {
        let rules = _.clone(this._registration.columns);
        this._columns.forEach((name) => {
            if (rules[name] === '' || rules[name] === null) {
                delete rules[name];
            }
        });
        return rules;
    }
    get _columns() { return Object.keys(this._registration.columns); }
    get _table() { return this._registration.table; }
    get _key() { return this._registration.key; }
    getDB() {
        return this._database;
    }
    query() {
        return this._query ? this._query : this._query = this.getDB().get(this._table);
    }
    fill(data) {
        _.assignIn(this, _.pick(data, this._columns));
        return this;
    }
    serialize() {
        return _.pick(this, this._columns);
    }
    get querySelf() {
        let find = {};
        find[this._key.name] = this[this._key.name];
        return find;
    }
    save() {
        let find = {};
        find[this._key.name] = this[this._key.name];
        this.query().find(find);
        this.query().push(this.serialize()).value();
    }
    validate() {
        return new Validation(this.serialize(), this._registration.columns);
    }
    update() {
        this.query().find(this.querySelf).assign(this.serialize()).value();
    }
    delete() {
        this.query().remove(this.querySelf).value();
    }
};
__decorate([
    core_1.inject(core_1.COMMANDO.DATABASE), 
    __metadata('design:type', Database)
], Model.prototype, "_database", void 0);
Model = __decorate([
    core_1.injectable(), 
    __metadata('design:paramtypes', [])
], Model);
exports.Model = Model;
let Repository = class Repository {
    model(data) {
        if (data === undefined)
            return undefined;
        let model = getModel(this.getModelID());
        if (data)
            model.fill(data);
        return model;
    }
    get columns() {
        return Object.keys(models[this.getModelID()].columns);
    }
    get table() {
        return models[this.getModelID()].table;
    }
    get key() {
        return models[this.getModelID()].key;
    }
    get query() {
        return this._query ? this._query : this._query = this.db.get(this.table);
    }
    has(name) {
        return this.get(name) !== undefined;
    }
    get(name) {
        return this.model(this.findBy(this.key.name, name));
    }
    all() {
        let all = this.query.value();
        if (all.length > 0)
            return all.map((data) => this.model(data));
        return [];
    }
    find(keyValue) {
        return this.findBy(this.key.name, keyValue);
    }
    findBy(key, value) {
        let find = {};
        find[key] = value;
        return this.model(this.query.find(find).value());
    }
    filter(filter = {}) {
        return this.query.filter(filter).value();
    }
    count() {
        return parseInt(this.query.size().value());
    }
};
__decorate([
    core_1.inject(core_1.COMMANDO.DATABASE), 
    __metadata('design:type', Database)
], Repository.prototype, "db", void 0);
Repository = __decorate([
    core_1.injectable(), 
    __metadata('design:paramtypes', [])
], Repository);
exports.Repository = Repository;
//# sourceMappingURL=database.js.map