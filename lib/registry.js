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
Object.defineProperty(exports, "__esModule", { value: true });
var ioc_1 = require("./ioc");
var _ = require("lodash");
var Registry = Registry_1 = (function () {
    function Registry() {
        this._groups = [];
        this._commands = [];
        this._rootGroup = this.createGroup({
            name: '_root'
        });
        this._rootCommand = this.createCommand({
            name: '_root'
        });
    }
    Object.defineProperty(Registry.prototype, "commands", {
        get: function () {
            return _.chain(this._commands);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Registry.prototype, "groups", {
        get: function () {
            return _.chain(this._groups);
        },
        enumerable: true,
        configurable: true
    });
    Registry.prototype.getRoot = function (mode) {
        if (mode === "command")
            return this._rootCommand;
        if (mode === "group")
            return this._rootGroup;
        throw Error("Root does not exist for given mode: " + mode);
    };
    Registry.prototype.createGroup = function (options) {
        if (options === void 0) { options = {}; }
        options = _.merge({
            options: {}
        }, options);
        return options;
    };
    Registry.prototype.createCommand = function (options) {
        if (options === void 0) { options = {}; }
        options = _.merge({
            options: {},
            arguments: {}
        }, options);
        return options;
    };
    Registry.prototype.addGroup = function (options) {
        if (options === void 0) { options = {
            group: this._rootGroup,
        }; }
        this._groups.push(this.createGroup(options));
        return options;
    };
    Registry.prototype.addCommand = function (options) {
        if (options === void 0) { options = {
            group: this._rootGroup
        }; }
        options = this.createCommand(options);
        this._commands.push(options);
        return options;
    };
    Object.defineProperty(Registry, "instance", {
        get: function () {
            if (Registry_1._instance === undefined) {
                Registry_1._instance = ioc_1.Container.getInstance().make('console.registry');
            }
            return Registry_1._instance;
        },
        enumerable: true,
        configurable: true
    });
    Registry.makeOptions = function (cls, args) {
        var name, options, len = args.length;
        if (len === 1) {
            options = args[0];
            name = options.name;
        }
        if (len === 2) {
            name = args[0];
            options = args[1];
            options.name = name;
        }
        options.cls = cls;
        return options;
    };
    Registry.command = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return function (cls) {
            var options = Registry_1.makeOptions(cls, args);
            Registry_1.instance.addCommand(options);
        };
    };
    Registry.group = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return function (cls) {
            var options = Registry_1.makeOptions(cls, args);
            Registry_1.instance.addGroup(options);
        };
    };
    return Registry;
}());
Registry = Registry_1 = __decorate([
    ioc_1.Container.singleton('console.registry'),
    __metadata("design:paramtypes", [])
], Registry);
exports.Registry = Registry;
var Registry_1;
