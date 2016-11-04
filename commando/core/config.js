"use strict";
const util_1 = require("@radic/util");
const paths_1 = require("./paths");
const path_1 = require("path");
const fs_1 = require("fs");
const dotenv = require("dotenv");
let defaultConfig = {
    debug: false,
    env: {},
    cli: {
        showCopyright: true
    },
    auth: {
        connections: []
    }
};
let _config = new util_1.PersistentConfig(defaultConfig, paths_1.paths.userDataConfig);
var denvPath = path_1.join(paths_1.paths.root, '.env');
function parseEnvVal(val) {
    if (val === 'true' || val === 'false') {
        return val === 'true';
    }
    if (isFinite(val))
        return parseInt(val);
    return val;
}
if (fs_1.existsSync(denvPath)) {
    var denv = dotenv.parse(fs_1.readFileSync(denvPath));
    Object.keys(denv).forEach((key) => {
        let value = parseEnvVal(denv[key]);
        key = key.replace('_', '.');
        if (_config.has(key))
            _config.set(key, value);
    });
}
let config = util_1.Config.makeProperty(_config);
exports.config = config;
//# sourceMappingURL=config.js.map