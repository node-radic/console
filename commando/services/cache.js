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
const core_1 = require("../core");
const Cryptr = require("cryptr");
const fs_1 = require("fs");
const moment = require('moment');
const util_1 = require("@radic/util");
let Cache = class Cache {
    constructor(paths, keys, config) {
        this.paths = paths;
        this.keys = keys;
        this.config = config;
        this.items = new Map;
        this.cryptr = new Cryptr(this.keys.public);
        if (!fs_1.existsSync(this.paths.userCache)) {
            this.save();
        }
        else {
            this.load();
        }
    }
    encrypt(obj) {
        return this.cryptr.encrypt(JSON.stringify(obj));
    }
    decrypt(str) {
        return JSON.parse(this.cryptr.decrypt(str));
    }
    load() {
        this.items = this.decrypt(fs_1.readFileSync(this.paths.userCache, 'utf-8'));
        return this;
    }
    save() {
        if (this.config('debug') === true)
            fs_1.writeFileSync(this.paths.userCache + '.debug.json', JSON.stringify(this.items));
        fs_1.writeFileSync(this.paths.userCache, this.encrypt(this.items));
        return this;
    }
    set(key, value, duration = null) {
        this.items.set(key, {
            value,
            duration: duration ? moment.duration(duration).toJSON() : null,
            expires: duration ? moment().add(moment.duration(duration)).toJSON() : null
        });
        this.save();
    }
    get(key, defaultValue, duration) {
        if (!this.has(key) && !defaultValue)
            return null;
        if (!this.has(key && defaultValue))
            return this.getDefault(key, defaultValue, duration);
        let item = this.items.get(key);
        item.duration = item.duration ? moment.duration(item.duration) : null;
        item.expires = item.expires ? moment(item.expires) : null;
        return item.value;
    }
    getDefault(key, defaultValue, duration) {
        if (util_1.kindOf(defaultValue) === 'function') {
            defaultValue = defaultValue.apply();
        }
        this.set(key, defaultValue, duration);
    }
    has(key) {
        if (!this.items.has(key))
            return false;
        let item = this.items.get(key);
        if (item.expires && moment(item.expires).isAfter(moment()))
            return false;
        return true;
    }
    forget(key) {
        this.items.delete(key);
    }
    forever(key, value) {
        this.set(key, value, null);
    }
};
Cache = __decorate([
    core_1.provideSingleton(core_1.COMMANDO.CACHE),
    __param(0, core_1.inject(core_1.COMMANDO.PATHS)),
    __param(1, core_1.inject(core_1.COMMANDO.KEYS)),
    __param(2, core_1.inject(core_1.COMMANDO.CONFIG)), 
    __metadata('design:paramtypes', [Object, Object, Function])
], Cache);
exports.Cache = Cache;
//# sourceMappingURL=cache.js.map