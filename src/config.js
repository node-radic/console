"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("@radic/util");
var defaultConfig = {
    mode: "command",
    parser: {
        yargs: {
            'short-option-groups': true,
            'camel-case-expansion': true,
            'dot-notation': true,
            'parse-numbers': true,
            'boolean-negation': true,
            'duplicate-arguments-array': true,
            'flatten-duplicate-arrays': true
        },
        arguments: {
            nullUndefined: true,
            undefinedBooleanIsFalse: true
        }
    }
};
var _config = new util_1.Config(defaultConfig);
exports.config = util_1.Config.makeProperty(_config);
exports.default = exports.config;
//# sourceMappingURL=config.js.map