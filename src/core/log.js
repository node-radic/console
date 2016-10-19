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
var winston_1 = require("winston");
var Winston = require('winston');
var core_1 = require("../core");
var moment = require("moment");
var util_1 = require("util");
exports.LogLevel = {
    error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5
};
var Log = (function () {
    function Log() {
        this.winston = new (winston_1.Logger)({
            transports: [
                new winston_1.transports.Console({
                    handleExceptions: false,
                    timestamp: function () {
                        return moment().format('h:mm:ss');
                    },
                    prettyPrint: true,
                    formatter: function (options) {
                        var level = Winston['config'].colorize(options.level, options.level.toUpperCase());
                        var timestamp = options.level === 'error' || options.level === 'debug' ? "[" + options.timestamp() + "] " : '';
                        var out = "" + timestamp + level + " ::  " + (options.message ? options.message : '');
                        if (options.meta && Object.keys(options.meta).length)
                            out += '\n ' + util_1.inspect(options.meta, { colors: true, depth: 5, showHidden: true });
                        return out;
                    }
                })
            ],
            exitOnError: false
        });
    }
    Log.prototype._log = function (name, args) {
        this.winston.log.apply(this.winston, [name].concat(args));
        return this;
    };
    Log.prototype.setLevel = function (transport, level) {
        var _this = this;
        if (level) {
            this.winston.transports[transport].level = this.parseLevel(level);
        }
        else {
            level = this.parseLevel(transport);
            this.getTransports().forEach(function (name) { return _this.winston.transports[name].level = level; });
        }
        return this;
    };
    Log.prototype.parseLevel = function (level) {
        var levels = Object.keys(exports.LogLevel);
        if (typeof level === 'number')
            return levels[level];
        if (isFinite(level))
            return levels[parseInt(level)];
        return level;
    };
    Log.prototype.getTransports = function () { return Object.keys(this.winston.transports); };
    Log.prototype.getTransport = function (transport) { return this.winston.transports[transport]; };
    Log.prototype.getLevel = function () { return this.winston.level; };
    Log.prototype.getWinston = function () { return this.winston; };
    Log.prototype.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return this._log('log', args);
    };
    Log.prototype.query = function (options, callback) { this.winston.query(options, callback); };
    Log.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return this._log('error', args);
    };
    Log.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return this._log('warn', args);
    };
    Log.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return this._log('info', args);
    };
    Log.prototype.verbose = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return this._log('verbose', args);
    };
    Log.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return this._log('debug', args);
    };
    Log.prototype.silly = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return this._log('silly', args);
    };
    Log.prototype.on = function (event, handler) { this.winston.on.apply(event, handler); };
    Log.prototype.profile = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        this.winston.profile.apply(this.winston, args);
        return this;
    };
    Log = __decorate([
        core_1.injectable(), 
        __metadata('design:paramtypes', [])
    ], Log);
    return Log;
}());
exports.Log = Log;
//# sourceMappingURL=log.js.map