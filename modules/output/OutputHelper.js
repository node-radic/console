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
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var lodash_1 = require("lodash");
var util_1 = require("@radic/util");
var radical_console_1 = require("radical-console");
var ora = require("ora");
var tty = require('tty');
var Table = require("cli-table2");
var Output_1 = require("./Output");
var OutputHelper = /** @class */ (function () {
    function OutputHelper() {
        this.modifiedTable = false;
    }
    Object.defineProperty(OutputHelper.prototype, "parser", {
        get: function () { return this.output.util.parser; },
        enumerable: true,
        configurable: true
    });
    OutputHelper.prototype.styles = function (styles) {
        this.config.styles = _.merge({}, this.config.styles, styles);
        this.parser.colors.styles(this.config.styles);
    };
    OutputHelper.prototype.parse = function (text, force) {
        if (force === void 0) { force = false; }
        return this.output.util.parse(text, force);
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
        if (text === void 0) { text = ''; }
        this.output.write(text);
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
        this.output.line(text);
        return this;
    };
    OutputHelper.prototype.dump = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        args.forEach(function (arg) { return _this.output.dump(arg); });
        return this;
    };
    OutputHelper.prototype.macro = function (name) {
        return this.output.macro(name);
    };
    OutputHelper.prototype.setMacro = function (name, macro) {
        this.output.setMacro(name, macro);
        return this;
    };
    OutputHelper.prototype.tree = function (label, nodes) {
        var tree = require('archy')({ label: label, nodes: nodes });
        return this.line(tree);
    };
    /**
     * Integrates the color parser for cells into the table
     */
    OutputHelper.prototype.modifyTablePush = function () {
        if (this.modifiedTable)
            return;
        var _push = Table.prototype.push;
        var self = this;
        Table.prototype['addRow'] = function (row) {
            this.push(row.map(function (col) {
                if (util_1.kindOf(col) === 'string') {
                    col = self.parse(col);
                }
                return col;
            }));
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
        return new Table(util_1.kindOf(options) === 'array' ? { head: options } : options);
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
        if (util_1.kindOf(data) === 'array' && util_1.kindOf(data[0]) === 'object') {
            iCol = Object.keys(data[0]).length;
        }
        if (process.stdout.isTTY && iCol > 0) {
            // defaults.minWidth = (process.stdout[ 'getWindowSize' ]()[ 0 ] / 1.1) / iCol;
            // defaults.minWidth = defaults.minWidth > defaults.maxWidth ? defaults.maxWidth : defaults.minWidth;
        }
        var res = require('columnify')(data, lodash_1.merge({}, defaults, options));
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
    __decorate([
        radical_console_1.inject('cli.output'),
        __metadata("design:type", Output_1.Output)
    ], OutputHelper.prototype, "output", void 0);
    OutputHelper = __decorate([
        radical_console_1.helper('output', {
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
                        'top': '═',
                        'top-mid': '╤',
                        'top-left': '╔',
                        'top-right': '╗',
                        'bottom': '═',
                        'bottom-mid': '╧',
                        'bottom-left': '╚',
                        'bottom-right': '╝',
                        'left': '║',
                        'left-mid': '╟',
                        'mid': '─',
                        'mid-mid': '┼',
                        'right': '║',
                        'right-mid': '╢',
                        'middle': '│'
                    },
                    SLIM: { 'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' },
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
exports.OutputHelper = OutputHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3V0cHV0SGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiT3V0cHV0SGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsMEJBQTRCO0FBQzVCLGlDQUErQjtBQUMvQixvQ0FBcUM7QUFHckMsbURBQTZKO0FBQzdKLHlCQUEwQjtBQUUxQixJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDM0Isa0NBQW9DO0FBRXBDLG1DQUFrQztBQThEbEM7SUEzREE7UUF3SGMsa0JBQWEsR0FBWSxLQUFLLENBQUE7SUFvRzVDLENBQUM7SUEzSkcsc0JBQUksZ0NBQU07YUFBVixjQUF1QixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFBLENBQUMsQ0FBQzs7O09BQUE7SUFFdkQsNkJBQU0sR0FBTixVQUFPLE1BQVc7UUFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsNEJBQUssR0FBTCxVQUFNLElBQVksRUFBRSxLQUFzQjtRQUF0QixzQkFBQSxFQUFBLGFBQXNCO1FBQ3RDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFUyxrQ0FBVyxHQUFyQixVQUFzQixLQUFLLEVBQUUsSUFBSTtRQUM3QixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQUksS0FBSyxTQUFJLElBQUksVUFBSyxLQUFLLE1BQUcsQ0FBQyxDQUFBO0lBQ2hELENB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