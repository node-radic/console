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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var lodash_1 = require("lodash");
var core_1 = require("../core");
var definitions_1 = require("./definitions");
var argv_1 = require("./argv");
var OptionsDefinitionParser = (function () {
    function OptionsDefinitionParser(parsed) {
        this.parsed = parsed;
        this.errors = [];
    }
    OptionsDefinitionParser.prototype.parse = function () {
        this.args = argv_1.parseArgv(this.argv, this.definition.getOptions());
        this.parseOptions();
        this.parsed.argv = this.argv;
        this.parsed.args = this.args;
        this.parsed.errors = this.errors;
        this.parsed.definition = this.definition;
        this.parsed.options = this.options;
        this.parsed.help.enabled = this.definition.hasHelp();
        this.parsed.help.key = this.definition.getHelpKey();
        this.parsed.help.show = this.parsed.opt(this.parsed.help.key) === true;
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
    OptionsDefinitionParser = __decorate([
        core_1.injectable(),
        __param(0, core_1.inject(core_1.BINDINGS.PARSED_OPTIONS_DEFINITION)), 
        __metadata('design:paramtypes', [Object])
    ], OptionsDefinitionParser);
    return OptionsDefinitionParser;
}());
exports.OptionsDefinitionParser = OptionsDefinitionParser;
var ArgumentsDefinitionParser = (function (_super) {
    __extends(ArgumentsDefinitionParser, _super);
    function ArgumentsDefinitionParser(parsed) {
        _super.call(this, parsed);
        this.parsed = parsed;
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
    ArgumentsDefinitionParser = __decorate([
        core_1.injectable(),
        __param(0, core_1.inject(core_1.BINDINGS.PARSED_ARGUMENTS_DEFINITION)), 
        __metadata('design:paramtypes', [Object])
    ], ArgumentsDefinitionParser);
    return ArgumentsDefinitionParser;
}(OptionsDefinitionParser));
exports.ArgumentsDefinitionParser = ArgumentsDefinitionParser;
var CommandsDefinitionParser = (function (_super) {
    __extends(CommandsDefinitionParser, _super);
    function CommandsDefinitionParser(parsed) {
        _super.call(this, parsed);
        this.parsed = parsed;
    }
    CommandsDefinitionParser.prototype.parse = function () {
        _super.prototype.parse.call(this);
        if (this.definition instanceof definitions_1.CommandsDefinition === false)
            return this.parsed;
        this.query = lodash_1.clone(this.args.argv._);
        this.parsed.definition = this.definition;
        this.parsed.isRoot = this.query.length === 0;
        if (this.parsed.help.enabled && this.parsed.isRoot && this.config('descriptor.cli.showHelpAsDefault')) {
            this.parsed.help.show = true;
        }
        var resolved = this.factory.resolveFromArray(this.query);
        if (resolved) {
            this.parsed.isCommand = resolved.type === 'command';
            this.parsed.isGroup = resolved.type === 'group';
            this.parsed[resolved.type] = this.factory['create' + lodash_1.upperFirst(resolved.type)](resolved);
            this.parsed[resolved.type].parent = resolved.parent;
            if (this.parsed.isCommand) {
                this.parsed.command.argv = lodash_1.drop(this.argv, resolved.parts.length);
            }
        }
        return this.parsed;
    };
    __decorate([
        core_1.inject(core_1.BINDINGS.COMMANDS_FACTORY), 
        __metadata('design:type', Object)
    ], CommandsDefinitionParser.prototype, "factory", void 0);
    __decorate([
        core_1.inject(core_1.BINDINGS.CONFIG), 
        __metadata('design:type', Function)
    ], CommandsDefinitionParser.prototype, "config", void 0);
    CommandsDefinitionParser = __decorate([
        core_1.injectable(),
        __param(0, core_1.inject(core_1.BINDINGS.PARSED_COMMANDS_DEFINITION)), 
        __metadata('design:paramtypes', [Object])
    ], CommandsDefinitionParser);
    return CommandsDefinitionParser;
}(OptionsDefinitionParser));
exports.CommandsDefinitionParser = CommandsDefinitionParser;
//# sourceMappingURL=parsers.js.map