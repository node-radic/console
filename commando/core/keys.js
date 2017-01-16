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
const cryptico = require("cryptico");
const fs = require("fs-extra");
const bindings_1 = require("./bindings");
const paths_1 = require("./paths");
const path_1 = require("path");
const src_1 = require("../../src");
let Keys = class Keys {
    constructor() {
        this._secret = cryptico.generateRSAKey('pass', 1024);
        this._public = fs.existsSync(paths_1.paths.userPublicKeyFile) ? this.loadUserKeyFiles() : this.generateUserKeyFiles();
    }
    generateUserKeyFiles() {
        var key = cryptico.publicKeyString(this._secret);
        fs.ensureDirSync(path_1.dirname(paths_1.paths.userPublicKeyFile));
        fs.writeFileSync(paths_1.paths.userPublicKeyFile, key);
        return key;
    }
    loadUserKeyFiles() {
        return fs.readFileSync(paths_1.paths.userPublicKeyFile, 'utf-8');
    }
    get secret() { return this._secret; }
    get public() { return this._public; }
};
Keys = __decorate([
    src_1.provideSingleton(bindings_1.COMMANDO.KEYS), 
    __metadata('design:paramtypes', [])
], Keys);
exports.Keys = Keys;
//# sourceMappingURL=keys.js.map