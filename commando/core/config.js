"use strict";
const util_1 = require("@radic/util");
const Cryptr = require("cryptr");
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const dotenv = require("dotenv");
const keys_1 = require('./keys');
const paths_1 = require("./paths");
const fs_1 = require("fs");
let defaultConfig = {
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
class CommandoPersistentConfig extends util_1.Config {
    constructor(obj) {
        super({});
        this.saveEnabled = true;
        this.cryptr = new Cryptr((new keys_1.Keys())._public);
        this.defaultConfig = obj;
        this.load();
    }
    set(prop, value) {
        super.set(prop, value);
        return this.save();
    }
    unset(prop) {
        super.unset(prop);
        return this.save();
    }
    merge(...args) {
        super.merge.apply(this, args);
        return this.save();
    }
    save() {
        if (!this.saveEnabled)
            return this;
        const str = JSON.stringify(this.data);
        const encrypted = this.cryptr.encrypt(str);
        fs_extra_1.writeFileSync(paths_1.paths.userDataConfig, encrypted, { encoding: 'utf8' });
        if (true === true) {
            fs_extra_1.writeFileSync(paths_1.paths.userDataConfig + '.debug.json', JSON.stringify(this.data, undefined, 2), { encoding: 'utf8' });
        }
        return this;
    }
    load() {
        if (!fs_extra_1.existsSync(paths_1.paths.userDataConfig))
            return this;
        this.saveEnabled = false;
        this.data = this.defaultConfig;
        const str = fs_extra_1.readFileSync(paths_1.paths.userDataConfig, 'utf8');
        const decrypted = this.cryptr.decrypt(str);
        const parsed = JSON.parse(decrypted);
        this.merge(parsed);
        this.loadEnv();
        this.saveEnabled = true;
        return this;
    }
    reset() {
        if (!fs_extra_1.existsSync(paths_1.paths.userDataConfig))
            return this;
        fs_1.unlinkSync(paths_1.paths.userDataConfig);
        return this;
    }
    loadEnv() {
        let denvPath = path_1.join(paths_1.paths.root, '.env');
        if (fs_extra_1.existsSync(denvPath)) {
            var denv = dotenv.parse(fs_extra_1.readFileSync(denvPath));
            Object.keys(denv).forEach((key) => {
                let value = parseEnvVal(denv[key]);
                key = key.replace('_', '.');
                if (this.has(key))
                    this.set(key, value);
            });
        }
        return this;
    }
}
exports.CommandoPersistentConfig = CommandoPersistentConfig;
let _config = new CommandoPersistentConfig(defaultConfig);
let config = util_1.Config.makeProperty(_config);
exports.config = config;
//# sourceMappingURL=config.js.map