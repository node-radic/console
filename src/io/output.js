"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("../core");
var util_1 = require("util");
var Table = require("cli-table2");
var util_2 = require("@radic/util");
var lodash_1 = require("lodash");
var console_colors_1 = require("@radic/console-colors");
var archy = require("archy");
var truwrap = require('truwrap');
truwrap({});
exports.TABLE_STYLE = {
    FAT: {
        'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗',
        'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝',
        'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼',
        'right': '║', 'right-mid': '╢', 'middle': '│'
    },
    SLIM: { chars: { 'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' } },
    NONE: {
        'top': '', 'top-mid': '', 'top-left': '', 'top-right': '',
        'bottom': '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': '',
        'left': '', 'left-mid': '', 'mid': '', 'mid-mid': '',
        'right': '', 'right-mid': '', 'middle': ' '
    }
};
var Output = (function () {
    function Output() {
        this.useParser = true;
        this.colorsEnabled = true;
    }
    Object.defineProperty(Output.prototype, "parser", {
        get: function () {
            if (!this._parser) {
                this._parser = new console_colors_1.Parser;
                this._parser.colors.styles(this.config('styles'));
            }
            return this._parser;
        },
        enumerable: true,
        configurable: true
    });
    Output.prototype.dump = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        args.forEach(function (arg) { return _this.writeln(util_1.inspect(arg, { colors: _this.colorsEnabled, depth: 5, showHidden: true })); });
    };
    Object.defineProperty(Output.prototype, "nl", {
        get: function () {
            this.line();
            return this;
        },
        enumerable: true,
        configurable: true
    });
    Output.prototype.macro = function (name, fn) {
        if (fn)
            return fn.apply(this, [this]);
        this.macros[name] = fn;
    };
    Output.prototype.tree = function (label, nodes) {
        var tree = archy({ label: label, nodes: nodes });
        return this.line(tree);
    };
    Output.prototype.writeln = function (text) {
        if (text === void 0) { text = ''; }
        this.write(text + "\n");
        return this;
    };
    Output.prototype.line = function (text) {
        if (text === void 0) { text = ''; }
        this.writeln(text);
        return this;
    };
    Output.prototype.write = function (text) {
        if (this.useParser && this.colorsEnabled)
            text = this.parser.parse(text);
        process.stdout.write(text);
        return this;
    };
    Output.prototype.success = function (text) {
        this.styleString('success', text);
        return this;
    };
    Output.prototype.error = function (text) {
        this.styleString('error', text);
        return this;
    };
    Output.prototype.styleString = function (style, text) {
        this.writeln("{" + style + "}" + text + "{/" + style + "}");
    };
    Output.prototype.description = function (text) {
        this.styleString('description', text);
        return this;
    };
    Output.prototype.title = function (text) {
        this.styleString('title', text);
        return this;
    };
    Output.prototype.subtitle = function (text) {
        this.styleString('subtitle', text);
        return this;
    };
    Output.prototype.header = function (text) {
        this.styleString('header', text);
        return this;
    };
    Output.prototype.table = function (options) {
        if (options === void 0) { options = {}; }
        return new Table(util_2.kindOf(options) === 'array' ? { head: options } : options);
    };
    Output.prototype.columns = function (options) {
        if (options === void 0) { options = {}; }
        var chars = exports.TABLE_STYLE.NONE;
        options = util_2.kindOf(options) === 'array' ? lodash_1.merge({ head: options }, { chars: chars }) : lodash_1.merge(options, { chars: chars });
        return new Table(options);
    };
    Output.prototype.setUseParser = function (use) {
        this.useParser = use;
    };
    __decorate([
        core_1.inject(core_1.BINDINGS.CONFIG), 
        __metadata('design:type', Function)
    ], Output.prototype, "config", void 0);
    Output = __decorate([
        core_1.injectable(), 
        __metadata('design:paramtypes', [])
    ], Output);
    return Output;
}());
exports.Output = Output;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Output;
//# sourceMappingURL=output.js.map