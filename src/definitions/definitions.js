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
var OptionsDefinition = (function () {
    function OptionsDefinition(parser) {
        this.parser = parser;
        this._help = { enabled: false, key: undefined };
        this.types = ['array', 'boolean', 'count', 'number', 'string', 'nested'];
        this.setters = ['default', 'desc', 'narg', 'handler', 'alias'];
        this.reset();
    }
    OptionsDefinition.prototype.reset = function () {
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
    };
    OptionsDefinition.prototype.parse = function (argv) {
        this.parser.definition = this;
        this.parser.argv = argv;
        return this.parser.parse();
    };
    OptionsDefinition.prototype.getJoinedOptions = function () {
        var opts = this._options;
        var joined = {};
        ['array', 'boolean', 'count', 'number', 'string', 'nested'].forEach(function (type) {
            if (typeof opts[type] === "undefined")
                return;
            opts[type].forEach(function (key) {
                if (typeof joined[key] === "undefined") {
                    joined[key] = {};
                }
                lodash_1.merge(joined[key], {
                    type: type,
                    alias: opts.alias[key] || [],
                    desc: opts.desc[key] || '',
                    default: opts.default[key] || false,
                    narg: opts.narg[key] || 0,
                    handler: opts.handler[key] || undefined
                });
            });
        });
        return joined;
    };
    OptionsDefinition.prototype.example = function (str) {
        this._example = str;
        return this;
    };
    OptionsDefinition.prototype.usage = function (str) {
        this._usage = str;
        return this;
    };
    OptionsDefinition.prototype.getExample = function () { return this._example; };
    OptionsDefinition.prototype.getUsage = function () { return this._usage; };
    OptionsDefinition.prototype.hasHelp = function () {
        return this._help.enabled;
    };
    OptionsDefinition.prototype.getHelpKey = function () {
        return this._help.key;
    };
    OptionsDefinition.prototype.help = function (k, alias) {
        this._help.enabled = true;
        this._help.key = k;
        this.option(k, {
            alias: alias,
            desc: '',
            boolean: true,
            handler: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                console.log('handler');
            }
        });
        return this;
    };
    OptionsDefinition.prototype._push = function (option, value) {
        var _this = this;
        [].concat(value).forEach(function (key) { return _this.registerOption(key); });
        this._options[option].push.apply(this._options[option], [].concat(value));
        return this;
    };
    OptionsDefinition.prototype._set = function (option, key, value) {
        this._options[option][key] = value;
        return this;
    };
    Object.defineProperty(OptionsDefinition.prototype, "keys", {
        get: function () { return Object.keys(this._keys); },
        enumerable: true,
        configurable: true
    });
    OptionsDefinition.prototype.hasOption = function (key) { return this._keys[key] !== undefined && this._keys[key] === true; };
    OptionsDefinition.prototype.registerOption = function (key, force) {
        if (force === void 0) { force = false; }
        if (false === this.hasOption(key) || force)
            this._keys[key] = true;
        return this;
    };
    OptionsDefinition.prototype.getOptions = function () { return this._options; };
    OptionsDefinition.prototype.mergeOptions = function (definition) {
        var _this = this;
        var customizer = function (objValue, srcValue, key, object, source, stack) {
            if (lodash_1.isArray(objValue)) {
                return objValue.concat(srcValue);
            }
        };
        lodash_1.mergeWith(this._options, definition.getOptions(), customizer);
        definition.keys.forEach(function (key) { return _this.hasOption(key) === false ? _this.registerOption(key) : _this; });
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
    };
    OptionsDefinition.prototype.array = function (bools) { return this._push('array', bools); };
    OptionsDefinition.prototype.boolean = function (bools) { return this._push('boolean', bools); };
    OptionsDefinition.prototype.count = function (bools) { return this._push('count', bools); };
    OptionsDefinition.prototype.number = function (bools) { return this._push('number', bools); };
    OptionsDefinition.prototype.string = function (bools) { return this._push('string', bools); };
    OptionsDefinition.prototype.nested = function (bools) { return this._push('nested', bools); };
    OptionsDefinition.prototype.default = function (k, v) { return this._set('default', k, v); };
    OptionsDefinition.prototype.desc = function (k, v) { return this._set('desc', k, v); };
    OptionsDefinition.prototype.narg = function (k, v) { return this._set('narg', k, v); };
    OptionsDefinition.prototype.handler = function (k, v) { return this._set('handler', k, v); };
    OptionsDefinition.prototype.alias = function (x, y) {
        var _this = this;
        if (typeof x === 'object') {
            Object.keys(x).forEach(function (key) { return _this.alias(key, x[key]); });
        }
        else {
            this._options.alias[x] = (this._options.alias[x] || []).concat(y);
        }
        return this;
    };
    OptionsDefinition.prototype.coerce = function () { return this; };
    OptionsDefinition.prototype.option = function (k, o) {
        this.registerOption(k);
        if (o.boolean)
            this.boolean(k);
        if (o.number)
            this.number(k);
        if (o.string)
            this.string(k);
        if (o.nested)
            this.nested(k);
        if (o.count)
            this.count(k);
        if (o.alias)
            this.alias(k, o.alias);
        if (o.default)
            this.default(k, o.default);
        if (o.desc)
            this.desc(k, o.desc);
        if (o.narg)
            this.narg(k, o.narg);
        if (o.handler)
            this.handler(k, o.handler);
        return this;
    };
    OptionsDefinition.prototype.options = function (options) {
        var _this = this;
        Object.keys(options).forEach(function (key) {
            _this.option(key, options[key]);
        });
        return this;
    };
    OptionsDefinition = __decorate([
        core_1.injectable(),
        __param(0, core_1.inject(core_1.BINDINGS.OPTIONS_DEFINITION_PARSER)), 
        __metadata('design:paramtypes', [Object])
    ], OptionsDefinition);
    return OptionsDefinition;
}());
exports.OptionsDefinition = OptionsDefinition;
var ArgumentsDefinition = (function (_super) {
    __extends(ArgumentsDefinition, _super);
    function ArgumentsDefinition(parser) {
        _super.call(this, parser);
        this.parser = parser;
    }
    ArgumentsDefinition.prototype.parse = function (argv) {
        this.parser.definition = this;
        this.parser.argv = argv;
        return this.parser.parse();
    };
    ArgumentsDefinition.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this._arguments = {};
    };
    ArgumentsDefinition.prototype.mergeArguments = function (definition) {
        lodash_1.merge(this._arguments, definition.getArguments());
        return this;
    };
    ArgumentsDefinition.prototype.getArguments = function () {
        return this._arguments;
    };
    ArgumentsDefinition.prototype.argument = function (name, desc, required, type, def) {
        if (desc === void 0) { desc = ''; }
        if (required === void 0) { required = false; }
        if (type === void 0) { type = 'string'; }
        this._arguments[name] = { name: name, desc: desc, required: required, type: type, default: def };
        return this;
    };
    ArgumentsDefinition.prototype.arguments = function (args) {
        var _this = this;
        if (typeof args === 'string') {
        }
        else {
            Object.keys(args).forEach(function (name) {
                var arg = lodash_1.merge({ required: false, default: null, type: 'string' }, args[name]);
                _this.argument(name, arg.desc, arg.required, arg.type, arg.default);
            });
        }
        return this;
    };
    ArgumentsDefinition.prototype.hasArguments = function () {
        return Object.keys(this._arguments).length > 0;
    };
    ArgumentsDefinition = __decorate([
        core_1.injectable(),
        __param(0, core_1.inject(core_1.BINDINGS.ARGUMENTS_DEFINITION_PARSER)), 
        __metadata('design:paramtypes', [Object])
    ], ArgumentsDefinition);
    return ArgumentsDefinition;
}(OptionsDefinition));
exports.ArgumentsDefinition = ArgumentsDefinition;
var CommandsDefinition = (function (_super) {
    __extends(CommandsDefinition, _super);
    function CommandsDefinition(parser) {
        _super.call(this, parser);
        this.parser = parser;
    }
    CommandsDefinition.prototype.parse = function (argv) {
        this.parser.definition = this;
        this.parser.argv = argv;
        return this.parser.parse();
    };
    CommandsDefinition.prototype.getCommands = function () {
        return this.factory.commands;
    };
    CommandsDefinition.prototype.getGroups = function () {
        return this.factory.groups;
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
    return CommandsDefinition;
}(OptionsDefinition));
exports.CommandsDefinition = CommandsDefinition;
//# sourceMappingURL=definitions.js.map