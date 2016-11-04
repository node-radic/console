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
const winston_1 = require("winston");
const Winston = require('winston');
const core_1 = require("../core");
const moment = require("moment");
const util_1 = require("util");
exports.LogLevel = {
    error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5
};
let Log = class Log {
    constructor() {
        this.winston = new (winston_1.Logger)({
            transports: [
                new winston_1.transports.Console({
                    handleExceptions: false,
                    timestamp: function () {
                        return moment().format('h:mm:ss');
                    },
                    prettyPrint: true,
                    formatter: (options) => {
                        let level = Winston['config'].colorize(options.level, options.level.toUpperCase());
                        let timestamp = options.level === 'error' || options.level === 'debug' ? `[${options.timestamp()}] ` : '';
                        let out = `${timestamp}${level} ::  ${options.message ? options.message : ''}`;
                        if (options.meta && Object.keys(options.meta).length)
                            out += '\n ' + util_1.inspect(options.meta, { colors: true, depth: 5, showHidden: true });
                        return out;
                    }
                })
            ],
            exitOnError: false
        });
    }
    _log(name, args) {
        args[0] = this.out.parser.parse(args[0]);
        this.winston.log.apply(this.winston, [name].concat(args));
        return this;
    }
    setLevel(transport, level) {
        if (level) {
            this.winston.transports[transport].level = this.parseLevel(level);
        }
        else {
            level = this.parseLevel(transport);
            this.getTransports().forEach((name) => this.winston.transports[name].level = level);
        }
        return this;
    }
    parseLevel(level) {
        let levels = Object.keys(exports.LogLevel);
        if (typeof level === 'number')
            return levels[level];
        if (isFinite(level))
            return levels[parseInt(level)];
        return level;
    }
    getTransports() { return Object.keys(this.winston.transports); }
    getTransport(transport) { return this.winston.transports[transport]; }
    getLevel() { return this.winston.level; }
    getWinston() { return this.winston; }
    log(...args) { return this._log('log', args); }
    query(options, callback) { this.winston.query(options, callback); }
    error(...args) { return this._log('error', args); }
    warn(...args) { return this._log('warn', args); }
    info(...args) { return this._log('info', args); }
    verbose(...args) { return this._log('verbose', args); }
    debug(...args) { return this._log('debug', args); }
    silly(...args) { return this._log('silly', args); }
    on(event, handler) { this.winston.on.apply(event, handler); }
    profile(...args) {
        this.winston.profile.apply(this.winston, args);
        return this;
    }
};
__decorate([
    core_1.inject(core_1.BINDINGS.OUTPUT), 
    __metadata('design:type', Object)
], Log.prototype, "out", void 0);
Log = __decorate([
    core_1.injectable(), 
    __metadata('design:paramtypes', [])
], Log);
exports.Log = Log;
//# sourceMappingURL=log.js.map