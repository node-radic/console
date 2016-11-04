"use strict";
const yargsParser = require("yargs-parser");
function parseArgv(argv, options) {
    return yargsParser.detailed(argv, options || {});
}
exports.parseArgv = parseArgv;
//# sourceMappingURL=argv.js.map