"use strict";
var yargsParser = require("yargs-parser");
function parseArgv(argv, options) {
    return yargsParser.detailed(argv, options || {});
}
exports.parseArgv = parseArgv;
//# sourceMappingURL=parser.argv.js.map