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
var core_1 = require("../core");
var definition_commands_1 = require("./definition.commands");
var parser_options_1 = require("./parser.options");
var bindings_1 = require("../core/bindings");
var lodash_1 = require("lodash");
var ParsedCommandsDefinition = (function (_super) {
    __extends(ParsedCommandsDefinition, _super);
    function ParsedCommandsDefinition() {
        _super.apply(this, arguments);
        this.isRoot = false;
        this.isCommand = false;
        this.isGroup = false;
    }
    ParsedCommandsDefinition = __decorate([
        core_1.injectable(), 
        __metadata('design:paramtypes', [])
    ], ParsedCommandsDefinition);
    return ParsedCommandsDefinition;
}(parser_options_1.ParsedOptionsDefinition));
exports.ParsedCommandsDefinition = ParsedCommandsDefinition;
var CommandsDefinitionParser = (function (_super) {
    __extends(CommandsDefinitionParser, _super);
    function CommandsDefinitionParser() {
        _super.apply(this, arguments);
    }
    CommandsDefinitionParser.prototype.parse = function () {
        _super.prototype.parse.call(this);
        if (this.definition instanceof definition_commands_1.CommandsDefinition === false)
            return this.parsed;
        this.query = lodash_1.clone(this.args.argv._);
        var tree = this.factory.getTree();
        this.parsed.definition = this.definition;
        this.parsed.isRoot = this.query.length === 0;
        var resolved = this.factory.resolveFromArray(this.query);
        if (resolved) {
            this.parsed.isCommand = resolved.type === 'command';
            this.parsed.isGroup = resolved.type === 'group';
            this.parsed[resolved.type] = this.factory['create' + lodash_1.upperFirst(resolved.type)](resolved);
        }
        return this.parsed;
    };
    __decorate([
        core_1.inject(bindings_1.BINDINGS.PARSED_COMMANDS_DEFINITION), 
        __metadata('design:type', Object)
    ], CommandsDefinitionParser.prototype, "parsed", void 0);
    __decorate([
        core_1.inject(bindings_1.BINDINGS.COMMANDS_FACTORY), 
        __metadata('design:type', Object)
    ], CommandsDefinitionParser.prototype, "factory", void 0);
    CommandsDefinitionParser = __decorate([
        core_1.injectable(), 
        __metadata('design:paramtypes', [])
    ], CommandsDefinitionParser);
    return CommandsDefinitionParser;
}(parser_options_1.OptionsDefinitionParser));
exports.CommandsDefinitionParser = CommandsDefinitionParser;
//# sourceMappingURL=parser.commands.js.map