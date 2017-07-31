"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../../src");
var util_1 = require("@radic/util");
function bootstrap(helpers, config) {
    if (config === void 0) { config = {}; }
    src_1.cli.config.merge(config);
    util_1.objectLoop(helpers, function (name, config) {
        src_1.cli.helper(name, config);
    });
    return src_1.cli;
}
exports.bootstrap = bootstrap;
