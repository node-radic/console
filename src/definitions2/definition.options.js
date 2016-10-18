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
var OptionsDefinition = (function () {
    function OptionsDefinition() {
        this._help = { enabled: false, key: undefined };
        this.reset();
    }
    OptionsDefinition.prototype.hasHelp = function () {
        return this._help.enabled;
    };
    OptionsDefinition.prototype.getHelpKey = function () {
        return this._help.key;
    };
    OptionsDefinition.prototype.reset = function () {
        this._keys = {};
        this._options = {
            alias: {},
            array: [],
            boolean: [],
            count: [],
            coerce: {},
            default: {},
            narg: {},
            number: [],
            string: [],
            nested: [],
            desc: {},
            handler: {}
        };
    };
    OptionsDefinition.prototype.getJoinedOptions = function () {
        var opts = this._options;
        var joined = {};
        ['array', 'boolean', 'count', 'number', 'nested'].forEach(function (type) {
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
    OptionsDefinition.prototype.help = function (k, alias) {
        this._help.enabled = true;
        this._help.key = k;
        this.option(k, {
            alias: alias, desc: '', handler: function () {
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
    OptionsDefinition.prototype.mergeOptions = function (definition) {
        var _this = this;
        var customizer = function (objValue, srcValue, key, object, source, stack) {
            if (lodash_1.isArray(objValue)) {
                return objValue.concat(srcValue);
            }
        };
        lodash_1.mergeWith(this._options, definition.getOptions(), customizer);
        definition.keys.forEach(function (key) { return _this.hasOption(key) === false ? _this.registerOption(key) : _this; });
        return this;
    };
    OptionsDefinition.prototype.getOptions = function () { return this._options; };
    OptionsDefinition.prototype.array = function (bools) { return this._push('array', bools); };
    OptionsDefinition.prototype.boolean = function (bools) { return this._push('boolean', bools); };
    OptionsDefinition.prototype.count = function (bools) { return this._push('count', bools); };
    OptionsDefinition.prototype.number = function (bools) { return this._push('number', bools); };
    OptionsDefinition.prototype.string = function (bools) { return this._push('string', bools); };
    OptionsDefinition.prototype.nested = function (bools) { return this._push('nested', bools); };
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
    OptionsDefinition.prototype.coerce = function () {
        return this;
    };
    OptionsDefinition.prototype.default = function (k, val) {
        this._options.default[k] = val;
        return this;
    };
    OptionsDefinition.prototype.describe = function (k, val) {
        this._options.desc[k] = val;
        return this;
    };
    OptionsDefinition.prototype.handler = function (k, v) {
        this._options.handler[k] = v;
        return this;
    };
    OptionsDefinition.prototype.option = function (k, o) {
        this.registerOption(k);
        if (o.boolean)
            this.boolean(k);
        if (o.getCountRecords)
            this.count(k);
        if (o.number)
            this.number(k);
        if (o.string)
            this.string(k);
        if (o.nested)
            this.nested(k);
        if (o.alias)
            this.alias(k, o.alias);
        if (o.coerce)
            this.coerce();
        if (o.default)
            this.default(k, o.default);
        if (o.desc)
            this.describe(k, o.desc);
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
        __metadata('design:paramtypes', [])
    ], OptionsDefinition);
    return OptionsDefinition;
}());
exports.OptionsDefinition = OptionsDefinition;
//# sourceMappingURL=definition.options.js.map