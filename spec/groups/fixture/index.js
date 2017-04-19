"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../../../src");
__export(require("./nodes"));
__export(require("./root"));
exports.cli = src_1.Cli.getInstance();
exports.cli
    .helpers('input')
    .helper('output', {
    quiet: false,
    colors: true,
    styles: {
        success: 'blue lighten 20 bold',
    }
})
    .helper('describer', {
    option: {
        key: 'h',
        aliases: ['help']
    }
});
exports.default = exports.cli;
//# sourceMappingURL=index.js.map