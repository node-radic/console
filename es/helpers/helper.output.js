var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import * as _ from "lodash";
import { merge } from "lodash";
import { kindOf } from "@radic/util";
import { Parser } from "@radic/console-colors";
import { inspect } from "util";
import { helper } from "../decorators";
import * as ora from 'ora';
var tty = require('tty');
import * as Table from 'cli-table2';
var OutputHelper = /** @class */ (function () {
    function OutputHelper() {
        this.modifiedTable = false;
    }
    Object.defineProperty(OutputHelper.prototype, "parser", {
        get: function () {
            if (!this._parser) {
                this._parser = new Parser;
                this._parser.colors.styles(this.config.styles);
            }
            return this._parser;
        },
        enumerable: true,
        configurable: true
    });
    OutputHelper.prototype.styles = function (styles) {
        this._parser = new Parser;
        this.config.styles = _.merge(this.config.styles, styles);
        this._parser.colors.styles(this.config.styles);
    };
    OutputHelper.prototype.parse = function (text, force) {
        if (force === void 0) { force = false; }
        if (this.config.colors === false && force === false) {
            return this.parser.clean(text);
        }
        return this.parser.parse(text);
    };
    OutputHelper.prototype.styleString = function (style, text) {
        this.writeln("{" + style + "}" + text + "{/" + style + "}");
    };
    Object.defineProperty(OutputHelper.prototype, "nl", {
        get: function () {
            this.writeln();
            return this;
        },
        enumerable: true,
        configurable: true
    });
    OutputHelper.prototype.write = function (text) {
        if (this.config.quiet)
            return this;
        if (!this.config.colors)
            text = this.parser.clean(text);
        else
            text = this.parser.parse(text);
        process.stdout.write(text);
        return this;
    };
    OutputHelper.prototype.writeln = function (text) {
        if (text === void 0) { text = ''; }
        if (this.config.resetOnNewline)
            this.write('{reset}');
        this.write(text + "\n");
        return this;
    };
    OutputHelper.prototype.line = function (text) {
        if (text === void 0) { text = ''; }
        this.writeln(text);
        return this;
    };
    OutputHelper.prototype.dump = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        args.forEach(function (arg) { return _this.writeln(inspect(arg, { colors: _this.config.colors, depth: 5, showHidden: true })); });
    };
    /** dump parsed stuff, so no colors **/
    OutputHelper.prototype.dumpp = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        args.forEach(function (arg) { return _this.writeln(inspect(arg, { colors: false, depth: 5, showHidden: true })); });
    };
    OutputHelper.prototype.macro = function (name, fn) {
        if (fn)
            return fn.apply(this, [this]);
        this.macros[name] = fn;
    };
    OutputHelper.prototype.tree = function (label, nodes) {
        var tree = require('archy')({ label: label, nodes: nodes });
        return this.line(tree);
    };
    /**
     * Integrates the color parser for cells into the table
     */
    OutputHelper.prototype.modifyTablePush = function () {
        var _this = this;
        if (this.modifiedTable)
            return;
        var _push = Table.prototype.push;
        Table.prototype.push = function () {
            var items = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                items[_i] = arguments[_i];
            }
            items.map(function (item) {
                if (kindOf(item) === 'string') {
                    item = _this.parse(item);
                }
                return item;
            });
            return _push.apply(_this, items);
        };
        this.modifiedTable = true;
    };
    /**
     * Create a table
     * @param {CliTable2.TableConstructorOptions | string[]} options Accepts a options object or header names as string array
     * @returns {any[]}
     */
    OutputHelper.prototype.table = function (options) {
        if (options === void 0) { options = {}; }
        this.modifyTablePush();
        return new Table(kindOf(options) === 'array' ? { head: options } : options);
    };
    OutputHelper.prototype.columns = function (data, options, ret) {
        if (options === void 0) { options = {}; }
        if (ret === void 0) { ret = false; }
        var defaults = {
            minWidth: 20,
            maxWidth: 120,
            preserveNewLines: true,
            columnSplitter: ' | '
        };
        var iCol = 0;
        if (kindOf(data) === 'array' && kindOf(data[0]) === 'object') {
            iCol = Object.keys(data[0]).length;
        }
        if (process.stdout.isTTY && iCol > 0) {
            // defaults.minWidth = (process.stdout[ 'getWindowSize' ]()[ 0 ] / 1.1) / iCol;
            // defaults.minWidth = defaults.minWidth > defaults.maxWidth ? defaults.maxWidth : defaults.minWidth;
        }
        var res = require('columnify')(data, merge({}, defaults, options));
        if (ret)
            return res;
        this.writeln(res);
    };
    OutputHelper.prototype.success = function (text) {
        this.styleString('success', text);
        return this;
    };
    OutputHelper.prototype.error = function (text) {
        this.styleString('error', text);
        return this;
    };
    OutputHelper.prototype.warning = function (text) {
        this.styleString('error', text);
        return this;
    };
    OutputHelper.prototype.spinner = function (text, options) {
        if (text === void 0) { text = ''; }
        if (options === void 0) { options = {}; }
        var spinner = ora(options);
        spinner.text = text;
        return spinner;
    };
    OutputHelper.prototype.onExecuteCommandParse = function (event) {
        if (this.config.options.quiet.enabled) {
            event.cli.global(this.config.options.quiet.key, {
                name: this.config.options.quiet.name,
                description: 'Disables all output '
            });
        }
        if (this.config.options.colors.enabled) {
            event.cli.global(this.config.options.colors.key, {
                name: this.config.options.colors.name,
                description: 'Disables color output'
            });
        }
    };
    OutputHelper.prototype.onExecuteCommandParsed = function (event) {
        if (this.config.options.quiet.enabled && event.argv[this.config.options.quiet.key]) {
            this.config.quiet = true;
        }
        if (this.config.options.colors.enabled && event.argv[this.config.options.colors.key]) {
            this.config.colors = false;
        }
    };
    OutputHelper = __decorate([
        helper('output', {
            singleton: true,
            config: {
                quiet: false,
                colors: true,
                options: {
                    quiet: {
                        enabled: false,
                        key: 'q',
                        name: 'quiet'
                    },
                    colors: {
                        enabled: false,
                        key: 'C',
                        name: 'no-colors'
                    }
                },
                resetOnNewline: true,
                styles: {
                    title: 'yellow bold',
                    subtitle: 'yellow',
                    success: 'green lighten 20 bold',
                    warning: 'orange lighten 20 bold',
                    error: 'red lighten 20 bold',
                },
                tableStyle: {
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
                }
            },
            listeners: {
                'cli:execute:parse': 'onExecuteCommandParse',
                'cli:execute:parsed': 'onExecuteCommandParsed'
            }
        })
    ], OutputHelper);
    return OutputHelper;
}());
export { OutputHelper };
