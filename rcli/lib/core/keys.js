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
Object.defineProperty(exports, "__esModule", { value: true });
var cryptico = require("cryptico");
var fs = require("fs-extra");
var paths_1 = require("./paths");
var path_1 = require("path");
var src_1 = require("../../../src");
var Keys = (function () {
    function Keys() {
        this._secret = cryptico.generateRSAKey('pass', 1024);
        this._public = fs.existsSync(paths_1.paths.userPublicKeyFile) ? this.loadUserKeyFiles() : this.generateUserKeyFiles();
    }
    Keys.prototype.generateUserKeyFiles = function () {
        var key = cryptico.publicKeyString(this._secret);
        fs.ensureDirSync(path_1.dirname(paths_1.paths.userPublicKeyFile));
        fs.writeFileSync(paths_1.paths.userPublicKeyFile, key);
        return key;
    };
    Keys.prototype.loadUserKeyFiles = function () {
        return fs.readFileSync(paths_1.paths.userPublicKeyFile, 'utf-8');
    };
    Object.defineProperty(Keys.prototype, "secret", {
        get: function () { return this._secret; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Keys.prototype, "public", {
        get: function () { return this._public; },
        enumerable: true,
        configurable: true
    });
    return Keys;
}());
Keys = __decorate([
    src_1.singleton('keys'),
    __metadata("design:paramtypes", [])
], Keys);
exports.Keys = Keys;
//# sourceMappingURL=keys.js.map