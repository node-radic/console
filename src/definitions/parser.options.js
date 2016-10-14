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
var lodash_1 = require("lodash");
var core_1 = require("../core");
var parser_argv_1 = require("./parser.argv");
var ParsedOptionsDefinition = (function () {
    function ParsedOptionsDefinition() {
        this.options = {};
        this.errors = [];
    }
    ParsedOptionsDefinition.prototype.hasOpt = function (n) {
        return typeof this.options[n] !== "undefined";
    };
    Object.defineProperty(ParsedOptionsDefinition.prototype, "nopts", {
        get: function () {
            return Object.keys(this.options).length;
        },
        enumerable: true,
        configurable: true
    });
    ParsedOptionsDefinition.prototype.opt = function (n) {
        if (false === this.hasOpt(n))
            return false;
        return this.options[n];
    };
    ParsedOptionsDefinition.prototype.hasErrors = function () {
        return this.errors.length > 0;
    };
    ParsedOptionsDefinition = __decorate([
        core_1.injectable(), 
        __metadata('design:paramtypes', [])
    ], ParsedOptionsDefinition);
    return ParsedOptionsDefinition;
}());
exports.ParsedOptionsDefinition = ParsedOptionsDefinition;
var OptionsDefinitionParser = (function () {
    function OptionsDefinitionParser() {
        this.errors = [];
    }
    OptionsDefinitionParser.prototype.parse = function () {
        this.args = parser_argv_1.parseArgv(this.argv, this.definition.getOptions());
        this.parseOptions();
        this.parsed.argv = this.argv;
        this.parsed.args = this.args;
        this.parsed.errors = this.errors;
        this.parsed.definition = this.definition;
        this.parsed.options = this.options;
        return this.parsed;
    };
    OptionsDefinitionParser.prototype.parseOptions = function () {
        var _this = this;
        this.definition.getOptions().nested.forEach(function (key) {
            var defaults = _this.definition.getOptions().default[key];
            var aliases = _this.args.aliases[key];
            _this.args.argv[key] = lodash_1.merge({}, defaults, _this.args.argv[key]);
            aliases.forEach(function (alias) { return _this.args.argv[alias] = lodash_1.merge({}, defaults, _this.args.argv[alias]); });
        });
        var options = lodash_1.clone(this.args.argv);
        delete options._;
        this.options = options;
    };
    __decorate([
        core_1.inject(core_1.BINDINGS.PARSED_OPTIONS_DEFINITION), 
        __metadata('design:type', Object)
    ], OptionsDefinitionParser.prototype, "parsed", void 0);
    OptionsDefinitionParser = __decorate([
        core_1.injectable(), 
        __metadata('design:paramtypes', [])
    ], OptionsDefinitionParser);
    return OptionsDefinitionParser;
}());
exports.OptionsDefinitionParser = OptionsDefinitionParser;
//# sourceMappingURL=parser.options.js.map