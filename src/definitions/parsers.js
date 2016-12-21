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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
const lodash_1 = require("lodash");
const core_1 = require("../core");
const definitions_1 = require("./definitions");
const argv_1 = require("./argv");
let OptionsDefinitionParser = class OptionsDefinitionParser {
    constructor(parsed) {
        this.parsed = parsed;
        this.errors = [];
    }
    parse() {
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
    }
    parseOptions() {
        this.definition.getOptions().nested.forEach((key) => {
            let defaults = this.definition.getOptions().default[key];
            let aliases = this.args.aliases[key];
            this.args.argv[key] = lodash_1.merge({}, defaults, this.args.argv[key]);
            aliases.forEach((alias) => this.args.argv[alias] = lodash_1.merge({}, defaults, this.args.argv[alias]));
        });
        let options = lodash_1.clone(this.args.argv);
        delete options._;
        this.options = options;
    }
};
OptionsDefinitionParser = __decorate([
    core_1.injectable(),
    __param(0, core_1.inject(core_1.BINDINGS.PARSED_OPTIONS_DEFINITION)), 
    __metadata('design:paramtypes', [Object])
], OptionsDefinitionParser);
exports.OptionsDefinitionParser = OptionsDefinitionParser;
let ArgumentsDefinitionParser = class ArgumentsDefinitionParser extends OptionsDefinitionParser {
    constructor(parsed) {
        super(parsed);
        this.parsed = parsed;
    }
    parse() {
        super.parse();
        this.parseArguments();
        this.parsed.arguments = this.arguments;
        return this.parsed;
    }
    parseArguments() {
        let all = this.definition.getArguments();
        let input = {};
        let args = lodash_1.clone(this.args.argv._);
        let errors = [];
        Object.keys(all).forEach((name, i) => {
            let def = all[name];
            let value;
            if (i > args.length - 1) {
                if (all[name].required)
                    return this.errors.push(`The argument [${name}] is required`);
                else
                    value = all[name].default;
            }
            else {
                value = args[i];
            }
            if (def.type === 'array') {
                value = value ? value.split(',') : [];
            }
            if (def.type === 'string') {
                try {
                    value = value.toString();
                }
                catch (e) { }
            }
            input[name] = value;
        });
        this.arguments = input;
    }
};
ArgumentsDefinitionParser = __decorate([
    core_1.injectable(),
    __param(0, core_1.inject(core_1.BINDINGS.PARSED_ARGUMENTS_DEFINITION)), 
    __metadata('design:paramtypes', [Object])
], ArgumentsDefinitionParser);
exports.ArgumentsDefinitionParser = ArgumentsDefinitionParser;
let CommandsDefinitionParser = class CommandsDefinitionParser extends OptionsDefinitionParser {
    constructor(parsed) {
        super(parsed);
        this.parsed = parsed;
    }
    parse() {
        super.parse();
        if (this.definition instanceof definitions_1.CommandsDefinition === false)
            return this.parsed;
        this.query = lodash_1.clone(this.args.argv._);
        this.parsed.definition = this.definition;
        this.parsed.isRoot = this.query.length === 0;
        if (this.parsed.help.enabled && this.parsed.isRoot && this.config('descriptor.cli.showHelpAsDefault')) {
            this.parsed.help.show = true;
        }
        let resolved = this.factory.resolveFromArray(this.query);
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
    }
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
exports.CommandsDefinitionParser = CommandsDefinitionParser;
//# sourceMappingURL=parsers.js.map