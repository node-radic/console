"use strict";
var util_1 = require("@radic/util");
var paths_1 = require("./paths");
var path_1 = require("path");
var fs_1 = require("fs");
var dotenv = require("dotenv");
var defaultConfig = {
    debug: false,
    env: {},
    cli: {
        showCopyright: true
    },
    auth: {
        connections: []
    }
};
var _config = new util_1.PersistentConfig(defaultConfig, paths_1.paths.userDataConfig);
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
    Object.keys(denv).forEach(function (key) {
        var value = parseEnvVal(denv[key]);
        key = key.replace('_', '.');
        _config.set('env.' + key, value);
        if (_config.has(key))
            _config.set(key, value);
    });
}
var config = util_1.Config.makeProperty(_config);
exports.config = config;
//# sourceMappingURL=config.js.map