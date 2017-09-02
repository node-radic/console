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
var lodash_1 = require("lodash");
var util_1 = require("util");
var radical_console_1 = require("radical-console");
var OutputUtil_1 = require("./OutputUtil");
var Table = require("cli-table2");
var util_2 = require("@radic/util");
var console_colors_1 = require("@radic/console-colors");
var Output = /** @class */ (function () {
    function Output() {
        this._options = {
            enabled: true,
            colors: true,
            inspect: { showHidden: true, depth: 10 }
        };
        this.stdout = process.stdout;
        this.modifiedTable = false;
        this._parser = new console_colors_1.Parser();
        this.util = new OutputUtil_1.OutputUtil(this);
    }
    Object.defineProperty(Output.prototype, "parser", {
        get: function () { return this._parser; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "colors", {
        get: function () { return this._parser.colors; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "options", {
        get: function () { return this._options; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "nl", {
        get: function () { return this.write('\n'); },
        enumerable: true,
        configurable: true
    });
    Output.prototype.parse = function (text, force) { return this._parser.parse(text); };
    Output.prototype.clean = function (text) { return this._parser.clean(text); };
    Output.prototype.write = function (text) {
        if (this.options.colors) {
            text = this.parse(text);
        }
        else {
            text = this.clean(text);
        }
        this.stdout.write(text);
        return this;
    };
    Output.prototype.writeln = function (text) {
        if (text === void 0) { text = ''; }
        return this.write(text + '\n');
    };
    Output.prototype.line = function (text) {
        if (text === void 0) { text = ''; }
        return this.write(text + '\n');
    };
    Output.prototype.dump = function () {
        var _this = this;
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this._options.inspect.colors = this._options.colors;
        args.forEach(function (arg) { return _this.line(util_1.inspect(arg, _this._options.inspect)); });
        return this;
    };
    Output.prototype.macro = function (name) {
        var _this = this;
        return (function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return _this.macros[name].apply(_this, args);
        });
    };
    Output.prototype.setMacro = function (name, macro) {
        this.macros[name] = macro;
        return this;
    };
    Output.prototype.diff = function (o, o2) { return new radical_console_1.Diff(o, o2); };
    Output.prototype.spinner = function (text, options) {
        if (text === void 0) { text = ''; }
        if (options === void 0) { options = {}; }
        var ora = radical_console_1.requirePeer('ora');
        var spinner = ora(options);
        spinner.text = text;
        return spinner;
    };
    Output.prototype.beep = function (val, cb) {
        radical_console_1.requirePeer('beeper')(val);
        return this;
    };
    Output.prototype.tree = function (obj, opts, returnValue) {
        if (opts === void 0) { opts = {}; }
        if (returnValue === void 0) { returnValue = false; }
        var prefix = opts.prefix;
        delete opts.prefix;
        var tree = radical_console_1.requirePeer('archy')(obj, prefix, opts);
        return returnValue ? tree : this.line(tree);
    };
    /**
     * Integrates the color parser for cells into the table
     */
    Output.prototype.modifyTablePush = function () {
        if (this.modifiedTable)
            return;
        var _push = Table.prototype.push;
        var self = this;
        Table.prototype['addRow'] = function (row) {
            this.push(row.map(function (col) {
                if (util_2.kindOf(col) === 'string') {
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
    Output.prototype.table = function (options) {
        if (options === void 0) { options = {}; }
        this.modifyTablePush();
        var CliTable = radical_console_1.requirePeer('cli-table2');
        return new CliTable(util_2.kindOf(options) === 'array' ? { head: options } : options);
    };
    Output.prototype.columns = function (data, options, ret) {
        if (options === void 0) { options = {}; }
        if (ret === void 0) { ret = false; }
        var defaults = {
            minWidth: 20,
            maxWidth: 120,
            preserveNewLines: true,
            columnSplitter: ' | '
        };
        var iCol = 0;
        if (util_2.kindOf(data) === 'array' && util_2.kindOf(data[0]) === 'object') {
            iCol = Object.keys(data[0]).length;
        }
        if (process.stdout.isTTY && iCol > 0) {
            // defaults.minWidth = (process.stdout[ 'getWindowSize' ]()[ 0 ] / 1.1) / iCol;
            // defaults.minWidth = defaults.minWidth > defaults.maxWidth ? defaults.maxWidth : defaults.minWidth;
        }
        var res = radical_console_1.requirePeer('columnify')(data, lodash_1.merge({}, defaults, options));
        if (ret)
            return res;
        this.writeln(res);
    };
    Output = __decorate([
        radical_console_1.singleton('cli.output'),
        __metadata("design:paramtypes", [])
    ], Output);
    return Output;
}());
exports.Output = Output;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3V0cHV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiT3V0cHV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsaUNBQThCO0FBRTlCLDZCQUErQztBQUMvQyxtREFBK0Q7QUFDL0QsMkNBQXlDO0FBQ3pDLGtDQUFvQztBQUVwQyxvQ0FBcUM7QUFDckMsd0RBQXVEO0FBR3ZEO0lBb0JJO1FBakJVLGFBQVEsR0FBa0I7WUFDaEMsT0FBTyxFQUFFLElBQUk7WUFDYixNQUFNLEVBQUcsSUFBSTtZQUNiLE9BQU8sRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRTtTQUMzQyxDQUFBO1FBR00sV0FBTSxHQUF1QixPQUFPLENBQUMsTUFBTSxDQUFBO1FBeUV4QyxrQkFBYSxHQUFZLEtBQUssQ0FBQTtRQTlEcEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLHVCQUFNLEVBQUUsQ0FBQTtRQUMzQixJQUFJLENBQUMsSUFBSSxHQUFNLElBQUksdUJBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBWEQsc0JBQUksMEJBQU07YUFBVixjQUF1QixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQSxDQUFDLENBQUM7OztPQUFBO0lBRTVDLHNCQUFJLDBCQUFNO2FBQVYsY0FBdUIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFFcEQsc0JBQUksMkJBQU87YUFBWCxjQUErQixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQSxDQUFBLENBQUM7OztPQUFBO0lBRXBELHNCQUFJLHNCQUFFO2FBQU4sY0FBaUIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUEsQ0FBQyxDQUFDOzs7T0FBQTtJQU8xQyxzQkFBSyxHQUFMLFVBQU0sSUFBWSxFQUFFLEtBQWUsSUFBVyxNQUFNLENBQUMsSUFB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