"use strict";
const bindings_1 = require("./bindings");
const src_1 = require("../../src");
exports.kernel = src_1.kernel;
var src_2 = require("../../src");
exports.lazyInject = src_2.lazyInject;
exports.provide = src_2.provide;
exports.provideSingleton = src_2.provideSingleton;
exports.inject = src_2.inject;
exports.injectable = src_2.injectable;
exports.decorate = src_2.decorate;
const config_1 = require("./config");
const paths_1 = require("./paths");
const keys_1 = require("./keys");
src_1.kernel.bind(bindings_1.default.CONFIG).toFunction(config_1.config);
src_1.kernel.bind(bindings_1.default.PATHS).toConstantValue(paths_1.paths);
src_1.kernel.bind(bindings_1.default.KEYS).to(keys_1.Keys);
//# sourceMappingURL=kernel.js.map