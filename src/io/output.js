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
const core_1 = require("../core");
const util_1 = require("util");
const Table = require("cli-table2");
const util_2 = require("@radic/util");
const lodash_1 = require("lodash");
const console_colors_1 = require("@radic/console-colors");
const archy = require("archy");
let truwrap = require('truwrap');
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
let Output = class Output {
    constructor() {
        this.useParser = true;
        this.colorsEnabled = true;
    }
    get parser() {
        if (!this._parser) {
            this._parser = new console_colors_1.Parser;
            this._parser.colors.styles(this.config('styles'));
        }
        return this._parser;
    }
    dump(...args) {
        args.forEach((arg) => this.writeln(util_1.inspect(arg, { colors: this.colorsEnabled, depth: 5, showHidden: true })));
    }
    get nl() {
        this.line();
        return this;
    }
    macro(name, fn) {
        if (fn)
            return fn.apply(this, [this]);
        this.macros[name] = fn;
    }
    tree(label, nodes) {
        let tree = archy({ label, nodes });
        return this.line(tree);
    }
    writeln(text = '') {
        this.write(text + "\n");
        return this;
    }
    line(text = '') {
        this.writeln(text);
        return this;
    }
    write(text) {
        if (this.useParser && this.colorsEnabled)
            text = this.parser.parse(text);
        process.stdout.write(text);
        return this;
    }
    success(text) {
        this.styleString('success', text);
        return this;
    }
    error(text) {
        this.styleString('error', text);
        return this;
    }
    styleString(style, text) {
        this.writeln(`{${style}}${text}{/${style}}`);
    }
    description(text) {
        this.styleString('description', text);
        return this;
    }
    title(text) {
        this.styleString('title', text);
        return this;
    }
    subtitle(text) {
        this.styleString('subtitle', text);
        return this;
    }
    header(text) {
        this.styleString('header', text);
        return this;
    }
    table(options = {}) {
        return new Table(util_2.kindOf(options) === 'array' ? { head: options } : options);
    }
    columns(options = {}) {
        let chars = exports.TABLE_STYLE.NONE;
        options = util_2.kindOf(options) === 'array' ? lodash_1.merge({ head: options }, { chars }) : lodash_1.merge(options, { chars });
        return new Table(options);
    }
    setUseParser(use) {
        this.useParser = use;
    }
};
__decorate([
    core_1.inject(core_1.BINDINGS.CONFIG), 
    __metadata('design:type', Function)
], Output.prototype, "config", void 0);
Output = __decorate([
    core_1.injectable(), 
    __metadata('design:paramtypes', [])
], Output);
exports.Output = Output;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Output;
//# sourceMappingURL=output.js.map