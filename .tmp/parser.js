"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var lodash_1 = require("lodash");
var inversify_1 = require("inversify");
var types_1 = require("../types");
var util_1 = require("@radic/util");
var yargsParser = require("yargs-parser");
var ParsedDefinition = (function () {
    function ParsedDefinition() {
        this.options = {};
        this.arguments = {};
        this.errors = [];
    }
    Object.defineProperty(ParsedDefinition.prototype, "nopts", {
        /** The number of options given */
        get: function () {
            return this.argv.length - this.nargs;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParsedDefinition.prototype, "nargs", {
        /** The number of arguments given */
        get: function () {
            return Object.keys(this.arguments).length;
        },
        enumerable: true,
        configurable: true
    });
    ParsedDefinition.prototype.hasArg = function (n) {
        return util_1.defined(this.arguments[n]);
    };
    ParsedDefinition.prototype.arg = function (n) {
        return this.arguments[n];
    };
    ParsedDefinition.prototype.hasOpt = function (n) {
        return util_1.defined(this.arguments[n]);
    };
    ParsedDefinition.prototype.opt = function (n) {
        if (false === this.hasOpt(n))
            return false;
        return this.options[n];
    };
    ParsedDefinition.prototype.hasErrors = function () {
        return this.errors.length > 0;
    };
    ParsedDefinition = __decorate([
        inversify_1.injectable()
    ], ParsedDefinition);
    return ParsedDefinition;
}());
exports.ParsedDefinition = ParsedDefinition;
var DefinitionParser = (function () {
    function DefinitionParser() {
        this.errors = [];
    }
    DefinitionParser.prototype.parse = function () {
        // first let yargs-parser make sense of it
        this.args = yargsParser.detailed(this.argv, this.definition.getOptions());
        // adjust the results / make our own representations of the options and arguments.
        this.parseOptions();
        this.parseArguments();
        // and build the parsed defintion from that
        this.parsed.argv = this.argv;
        this.parsed.args = this.args;
        this.parsed.errors = this.errors;
        this.parsed.definition = this.definition;
        this.parsed.arguments = this.arguments;
        this.parsed.options = this.options;
        // and return it :)
        return this.parsed;
    };
    DefinitionParser.prototype.parseArguments = function () {
        var _this = this;
        var all = this.definition.getArguments();
        // let names = Object.keys(all);
        var input = {};
        var args = lodash_1.clone(this.args.argv._);
        var errors = [];
        // Associate arguments with values
        Object.keys(all).forEach(function (name, i) {
            if (i > args.length - 1) {
                if (all[name].required)
                    return _this.errors.push("The argument [" + name + "] is required");
                input[name] = all[name].default;
            }
            else {
                input[name] = args[i];
            }
        });
        this.arguments = input;
    };
    DefinitionParser.prototype.parseOptions = function () {
        var _this = this;
        // re-apply "nested" options defaults
        this.definition.getOptions().nested.forEach(function (key) {
            var defaults = _this.definition.getOptions().default[key];
            var aliases = _this.args.aliases[key];
            _this.args.argv[key] = lodash_1.merge({}, defaults, _this.args.argv[key]);
            aliases.forEach(function (alias) { return _this.args.argv[alias] = lodash_1.merge({}, defaults, _this.args.argv[alias]); });
        });
        // clone the argv and remove the arguments from it, resulting in all the options
        var options = lodash_1.clone(this.args.argv);
        delete options._;
        this.options = options;
    };
    __decorate([
        inversify_1.inject(types_1.BINDINGS.PARSED_DEFINITION)
    ], DefinitionParser.prototype, "parsed", void 0);
    DefinitionParser = __decorate([
        inversify_1.injectable()
    ], DefinitionParser);
    return DefinitionParser;
}());
exports.DefinitionParser = DefinitionParser;
