"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("chai/register-assert"); // Using Assert style
require("chai/register-expect"); // Using Expect style
require("chai/register-should"); // Using Should style
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