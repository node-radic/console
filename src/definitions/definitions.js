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
let OptionsDefinition = class OptionsDefinition {
    constructor(parser) {
        this.parser = parser;
        this._help = { enabled: false, key: undefined };
        this.types = ['array', 'boolean', 'count', 'number', 'string', 'nested'];
        this.setters = ['default', 'desc', 'narg', 'handler', 'alias'];
        this.reset();
    }
    reset() {
        this._keys = {};
        this._options = {
            array: [],
            boolean: [],
            count: [],
            number: [],
            string: [],
            nested: [],
            alias: {},
            coerce: {},
            default: {},
            narg: {},
            desc: {},
            handler: {}
        };
    }
    parse(argv) {
        this.parser.definition = this;
        this.parser.argv = argv;
        return this.parser.parse();
    }
    getJoinedOptions() {
        let opts = this._options;
        let joined = {};
        ['array', 'boolean', 'count', 'number', 'string', 'nested'].forEach((type) => {
            if (typeof opts[type] === "undefined")
                return;
            opts[type].forEach((key) => {
                if (typeof joined[key] === "undefined") {
                    joined[key] = {};
                }
                lodash_1.merge(joined[key], {
                    type,
                    alias: opts.alias[key] || [],
                    desc: opts.desc[key] || '',
                    default: opts.default[key] || false,
                    narg: opts.narg[key] || 0,
                    handler: opts.handler[key] || undefined
                });
            });
        });
        return joined;
    }
    example(str) {
        this._example = str;
        return this;
    }
    usage(str) {
        this._usage = str;
        return this;
    }
    getExample() { return this._example; }
    getUsage() { return this._usage; }
    hasHelp() {
        return this._help.enabled;
    }
    getHelpKey() {
        return this._help.key;
    }
    help(k, alias) {
        this._help.enabled = true;
        this._help.key = k;
        this.option(k, {
            alias,
            desc: '',
            boolean: true,
            handler: (...args) => {
                console.log('handler');
            }
        });
        return this;
    }
    _push(option, value) {
        [].concat(value).forEach((key) => this.registerOption(key));
        this._options[option].push.apply(this._options[option], [].concat(value));
        return this;
    }
    _set(option, key, value) {
        this._options[option][key] = value;
        return this;
    }
    get keys() { return Object.keys(this._keys); }
    hasOption(key) { return this._keys[key] !== undefined && this._keys[key] === true; }
    registerOption(key, force = false) {
        if (false === this.hasOption(key) || force)
            this._keys[key] = true;
        return this;
    }
    getOptions() { return this._options; }
    mergeOptions(definition) {
        let customizer = (objValue, srcValue, key, object, source, stack) => {
            if (lodash_1.isArray(objValue)) {
                return objValue.concat(srcValue);
            }
        };
        lodash_1.mergeWith(this._options, definition.getOptions(), customizer);
        definition.keys.forEach((key) => this.hasOption(key) === false ? this.registerOption(key) : this);
        if (definition.hasHelp()) {
            if (!this.hasHelp()) {
                this._help.enabled = true;
                this._help.key = definition.getHelpKey();
            }
            else {
                this._help.key = definition.getHelpKey();
            }
        }
        return this;
    }
    array(bools) { return this._push('array', bools); }
    boolean(bools) { return this._push('boolean', bools); }
    count(bools) { return this._push('count', bools); }
    number(bools) { return this._push('number', bools); }
    string(bools) { return this._push('string', bools); }
    nested(bools) { return this._push('nested', bools); }
    default(k, v) { return this._set('default', k, v); }
    desc(k, v) { return this._set('desc', k, v); }
    narg(k, v) { return this._set('narg', k, v); }
    handler(k, v) { return this._set('handler', k, v); }
    alias(x, y) {
        if (typeof x === 'object') {
            Object.keys(x).forEach((key) => this.alias(key, x[key]));
        }
        else {
            this._options.alias[x] = (this._options.alias[x] || []).concat(y);
        }
        return this;
    }
    coerce() { return this; }
    option(k, o) {
        this.registerOption(k);
        this.types.forEach((type) => {
            if (o[type])
                this[type].apply(this, [k]);
        });
        this.setters.forEach((set) => {
            if (o[set])
                this[set].apply(this, [k, o[set]]);
        });
        return this;
    }
    options(options) {
        Object.keys(options).forEach((key) => {
            this.option(key, options[key]);
        });
        return this;
    }
};
OptionsDefinition = __decorate([
    core_1.injectable(),
    __param(0, core_1.inject(core_1.BINDINGS.OPTIONS_DEFINITION_PARSER)), 
    __metadata('design:paramtypes', [Object])
], OptionsDefinition);
exports.OptionsDefinition = OptionsDefinition;
let ArgumentsDefinition = class ArgumentsDefinition extends OptionsDefinition {
    constructor(parser) {
        super(parser);
        this.parser = parser;
    }
    parse(argv) {
        this.parser.definition = this;
        this.parser.argv = argv;
        return this.parser.parse();
    }
    reset() {
        super.reset();
        this._arguments = {};
    }
    mergeArguments(definition) {
        lodash_1.merge(this._arguments, definition.getArguments());
        return this;
    }
    getArguments() {
        return this._arguments;
    }
    argument(name, desc = '', required = false, type = 'string', def) {
        this._arguments[name] = { name, desc, required, type, default: def };
        return this;
    }
    arguments(args) {
        if (typeof args === 'string') {
        }
        else {
            Object.keys(args).forEach((name) => {
                let arg = lodash_1.merge({ required: false, default: null, type: 'string' }, args[name]);
                this.argument(name, arg.desc, arg.required, arg.type, arg.default);
            });
        }
        return this;
    }
    hasArguments() {
        return Object.keys(this._arguments).length > 0;
    }
};
ArgumentsDefinition = __decorate([
    core_1.injectable(),
    __param(0, core_1.inject(core_1.BINDINGS.ARGUMENTS_DEFINITION_PARSER)), 
    __metadata('design:paramtypes', [Object])
], ArgumentsDefinition);
exports.ArgumentsDefinition = ArgumentsDefinition;
let CommandsDefinition = class CommandsDefinition extends OptionsDefinition {
    constructor(parser) {
        super(parser);
        this.parser = parser;
    }
    parse(argv) {
        this.parser.definition = this;
        this.parser.argv = argv;
        return this.parser.parse();
    }
    getCommands() {
        return this.factory.commands;
    }
    getGroups() {
        return this.factory.groups;
    }
};
__decorate([
    core_1.inject(core_1.BINDINGS.COMMANDS_FACTORY), 
    __metadata('design:type', Object)
], CommandsDefinition.prototype, "factory", void 0);
CommandsDefinition = __decorate([
    core_1.injectable(),
    __param(0, core_1.inject(core_1.BINDINGS.COMMANDS_DEFINITION_PARSER)), 
    __metadata('design:paramtypes', [Object])
], CommandsDefinition);
exports.CommandsDefinition = CommandsDefinition;
//# sourceMappingURL=definitions.js.map