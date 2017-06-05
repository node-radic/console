"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@radic/util");
var Cryptr = require("cryptr");
var path_1 = require("path");
var fs_extra_1 = require("fs-extra");
var dotenv = require("dotenv");
var keys_1 = require("./keys");
var paths_1 = require("./paths");
var fs_1 = require("fs");
var Container_1 = require("../../../src/core/Container");
var defaultConfig = {
    debug: true,
    env: {},
    cli: {
        showCopyright: true
    },
    auth: {
        connections: []
    },
    dgram: {
        server: {
            port: 41333
        },
        client: {
            port: 41334
        }
    },
    pmove: {
        extensions: ['mp4', 'wma', 'flv', 'mkv', 'avi', 'wmv', 'mpg']
    },
    connect: {}
};
function parseEnvVal(val) {
    if (val === 'true' || val === 'false') {
        return val === 'true';
    }
    if (isFinite(val))
        return parseInt(val);
    return val;
}
var CommandoPersistentConfig = (function (_super) {
    __extends(CommandoPersistentConfig, _super);
    function CommandoPersistentConfig(obj) {
        var _this = _super.call(this, {}) || this;
        _this.saveEnabled = true;
        _this.cryptr = new Cryptr((new keys_1.Keys())._public);
        _this.defaultConfig = obj;
        _this.load();
        return _this;
    }
    CommandoPersistentConfig.prototype.set = function (prop, value) {
        _super.prototype.set.call(this, prop, value);
        return this.save();
    };
    CommandoPersistentConfig.prototype.unset = function (prop) {
        _super.prototype.unset.call(this, prop);
        return this.save();
    };
    CommandoPersistentConfig.prototype.merge = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        _super.prototype.merge.apply(this, args);
        return this.save();
    };
    CommandoPersistentConfig.prototype.save = function () {
        if (!this.saveEnabled)
            return this;
        var str = JSON.stringify(this.data);
        var encrypted = this.cryptr.encrypt(str);
        fs_extra_1.writeFileSync(paths_1.paths.userDataConfig, encrypted, { encoding: 'utf8' });
        if (true === true) {
            fs_extra_1.writeFileSync(paths_1.paths.userDataConfig + '.debug.json', JSON.stringify(this.data, undefined, 2), { encoding: 'utf8' });
        }
        return this;
    };
    CommandoPersistentConfig.prototype.load = function () {
        if (!fs_extra_1.existsSync(paths_1.paths.userDataConfig))
            return this;
        this.saveEnabled = false;
        this.data = this.defaultConfig;
        var str = fs_extra_1.readFileSync(paths_1.paths.userDataConfig, 'utf8');
        var decrypted = this.cryptr.decrypt(str);
        var parsed = JSON.parse(decrypted);
        this.merge(parsed);
        this.loadEnv();
        this.saveEnabled = true;
        return this;
    };
    CommandoPersistentConfig.prototype.reset = function () {
        if (!fs_extra_1.existsSync(paths_1.paths.userDataConfig))
            return this;
        fs_1.unlinkSync(paths_1.paths.userDataConfig);
        return this;
    };
    CommandoPersistentConfig.prototype.loadEnv = function () {
        var _this = this;
        var denvPath = path_1.join(paths_1.paths.root, '.env');
        if (fs_extra_1.existsSync(denvPath)) {
            var denv = dotenv.parse(fs_extra_1.readFileSync(denvPath));
            Object.keys(denv).forEach(function (key) {
                var value = parseEnvVal(denv[key]);
                key = key.replace('_', '.');
                if (_this.has(key))
                    _this.set(key, value);
            });
        }
        return this;
    };
    return CommandoPersistentConfig;
}(util_1.Config));
exports.CommandoPersistentConfig = CommandoPersistentConfig;
var _config = new CommandoPersistentConfig(defaultConfig);
var config = util_1.Config.makeProperty(_config);
exports.config = config;
Container_1.container.constant('config', config);
//# sourceMappingURL=config.js.map