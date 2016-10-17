"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var util_1 = require("@radic/util");
var core_1 = require("../core");
var parser_options_1 = require("./parser.options");
var ParsedArgumentsDefinition = (function (_super) {
    __extends(ParsedArgumentsDefinition, _super);
    function ParsedArgumentsDefinition() {
        _super.apply(this, arguments);
        this.arguments = {};
    }
    Object.defineProperty(ParsedArgumentsDefinition.prototype, "nargs", {
        get: function () {
            return Object.keys(this.arguments).length;
        },
        enumerable: true,
        configurable: true
    });
    ParsedArgumentsDefinition.prototype.hasArg = function (n) {
        return util_1.defined(this.arguments[n]);
    };
    ParsedArgumentsDefinition.prototype.arg = function (n) {
        return this.arguments[n];
    };
    ParsedArgumentsDefinition = __decorate([
        core_1.injectable(), 
        __metadata('design:paramtypes', [])
    ], ParsedArgumentsDefinition);
    return ParsedArgumentsDefinition;
}(parser_options_1.ParsedOptionsDefinition));
exports.ParsedArgumentsDefinition = ParsedArgumentsDefinition;
var ArgumentsDefinitionParser = (function (_super) {
    __extends(ArgumentsDefinitionParser, _super);
    function ArgumentsDefinitionParser() {
        _super.apply(this, arguments);
    }
    ArgumentsDefinitionParser.prototype.parse = function () {
        _super.prototype.parse.call(this);
        this.parseArguments();
        this.parsed.arguments = this.arguments;
        return this.parsed;
    };
    ArgumentsDefinitionParser.prototype.parseArguments = function () {
        var _this = this;
        var all = this.definition.getArguments();
        var input = {};
        var args = lodash_1.clone(this.args.argv._);
        var errors = [];
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
    __decorate([
        core_1.inject(core_1.BINDINGS.PARSED_ARGUMENTS_DEFINITION), 
        __metadata('design:type', Object)
    ], ArgumentsDefinitionParser.prototype, "parsed", void 0);
    ArgumentsDefinitionParser = __decorate([
        core_1.injectable(), 
        __metadata('design:paramtypes', [])
    ], ArgumentsDefinitionParser);
    return ArgumentsDefinitionParser;
}(parser_options_1.OptionsDefinitionParser));
exports.ArgumentsDefinitionParser = ArgumentsDefinitionParser;
//# sourceMappingURL=parser.arguments.js.map