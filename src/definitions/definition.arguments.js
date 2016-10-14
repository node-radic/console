"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var lodash_1 = require('lodash');
var definition_options_1 = require("./definition.options");
var ArgumentsDefinition = (function (_super) {
    __extends(ArgumentsDefinition, _super);
    function ArgumentsDefinition() {
        _super.apply(this, arguments);
    }
    ArgumentsDefinition.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this._arguments = {};
    };
    ArgumentsDefinition.prototype.mergeArguments = function (definition) {
        lodash_1.merge(this._arguments, definition.getArguments());
        return this;
    };
    ArgumentsDefinition.prototype.getArguments = function () {
        return this._arguments;
    };
    ArgumentsDefinition.prototype.argument = function (name, desc, required, type, def) {
        if (desc === void 0) { desc = ''; }
        if (required === void 0) { required = false; }
        if (type === void 0) { type = 'string'; }
        if (def === void 0) { def = null; }
        this._arguments[name] = { required: required, type: type, default: def };
        return this;
    };
    ArgumentsDefinition.prototype.arguments = function (args) {
        var _this = this;
        if (typeof args === 'string') {
        }
        else {
            Object.keys(args).forEach(function (name) {
                var arg = lodash_1.merge({ required: false, default: null, type: 'string' }, args[name]);
                _this.argument(name, arg.description, arg.required, arg.type, arg.default);
            });
        }
        return this;
    };
    ArgumentsDefinition.prototype.hasArguments = function () {
        return Object.keys(this._arguments).length > 0;
    };
    return ArgumentsDefinition;
}(definition_options_1.OptionsDefinition));
exports.ArgumentsDefinition = ArgumentsDefinition;
//# sourceMappingURL=definition.arguments.js.map