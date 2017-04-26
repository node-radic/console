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
    quietOption: { enabled: true },
    colorsOption: { enabled: true },
    styles: {
        success: 'blue lighten 20 bold',
    }
})
    .helper('describer', {
    helpOption: {
        enabled: true
    }
});
function start() {
    var parsedRootNode = exports.cli.parse();
    var parsedNode = exports.cli.resolve();
    exports.cli.handle(parsedNode);
}
exports.default = start;
//# sourceMappingURL=index.js.map