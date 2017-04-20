"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var through2 = require("through2");
var path = require("path");
var util_1 = require("@radic/util");
exports.default = function (options) { return through2.obj(function (file, enc, cb) {
    var filepath = file.path, cwd = file.cwd, relative = path.relative(cwd, filepath);
    util_1.inspect({ file: file, filepath: filepath, cwd: cwd, relative: relative });
}); };
//# sourceMappingURL=typedoc.js.map