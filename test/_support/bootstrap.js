"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = require("../../src");
const util_1 = require("@radic/util");
function bootstrap(helpers, config = {}) {
    src_1.cli.config.merge(config);
    util_1.objectLoop(helpers, (name, config) => {
        src_1.cli.helper(name, config);
    });
    return src_1.cli;
}
exports.bootstrap = bootstrap;
//# sourceMappingURL=bootstrap.js.map