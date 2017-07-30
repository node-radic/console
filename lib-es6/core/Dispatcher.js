var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { EventEmitter2 } from "eventemitter2";
import { lazyInject, singleton } from "./Container";
import { defined } from "@radic/util";
import { defaults } from "../defaults";
import { HaltEvent } from "./events";
var Dispatcher = (function () {
    function Dispatcher() {
        this.ee = new EventEmitter2(defaults.events());
    }
    Dispatcher.prototype.fire = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var event;
        var ctx = args[args.length - 1];
        if (args.length === 2)
            event = args[0];
        if (event === undefined)
            event = ctx.event;
        this.log.silly('firing event: ' + event, { ctx: ctx });
        this.emit(event, ctx);
        if (ctx instanceof HaltEvent) {
            if (ctx.halt) {
                this.halt(event, ctx);
            }
        }
        return ctx;
    };
    Dispatcher.prototype.halt = function (event, ctx) {
        process.exit();
    };
    Dispatcher.prototype.dispatch = function (name) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return new Promise(function (resolve, reject) {
            _this.emitAsync(name, _this).then(function (ret) {
                if (false === defined(ret) || ret !== false) {
                    return resolve(true);
                }
                resolve(false);
            });
        });
    };
    Dispatcher.prototype.enableDebug = function () {
        this.onAny(function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            console.log('event:', args[0]);
        });
    };
    Dispatcher.prototype.emit = function (event) {
        var values = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            values[_i - 1] = arguments[_i];
        }
        return this.ee.emit.apply(this.ee, [event].concat(values));
    };
    ;
    Dispatcher.prototype.emitAsync = function (event) {
        var values = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            values[_i - 1] = arguments[_i];
        }
        return this.ee.emitAsync.apply(this.ee, [event].concat(values));
    };
    Dispatcher.prototype.addListener = function (event, listener) { return this.ee.addListener.apply(this.ee, [event, listener]); };
    Dispatcher.prototype.on = function (event, listener) { return this.ee.on.apply(this.ee, [event, listener]); };
    Dispatcher.prototype.prependListener = function (event, listener) { return this.ee.prependListener.apply(this.ee, [event, listener]); };
    Dispatcher.prototype.once = function (event, listener) { return this.ee.once.apply(this.ee, [event, listener]); };
    Dispatcher.prototype.prependOnceListener = function (event, listener) { return this.ee.prependOnceListener.apply(this.ee, [event, listener]); };
    Dispatcher.prototype.many = function (event, timesToListen, listener) { return this.ee.many.apply(this.ee, [event, timesToListen, listener]); };
    Dispatcher.prototype.prependMany = function (event, timesToListen, listener) { return this.ee.prependMany.apply(this.ee, [event, timesToListen, listener]); };
    Dispatcher.prototype.onAny = function (listener) { return this.ee.onAny.apply(this.ee, [listener]); };
    Dispatcher.prototype.prependAny = function (listener) { return this.ee.prependAny.apply(this.ee, [listener]); };
    Dispatcher.prototype.offAny = function (listener) { return this.ee.offAny.apply(this.ee, [listener]); };
    Dispatcher.prototype.removeListener = function (event, listener) { return this.ee.removeListener.apply(this.ee, [event, listener]); };
    Dispatcher.prototype.off = function (event, listener) { return this.ee.off.apply(this.ee, [event, listener]); };
    Dispatcher.prototype.removeAllListeners = function (event) { return this.ee.removeAllListeners.apply(this.ee, [event]); };
    Dispatcher.prototype.setMaxListeners = function (n) { return this.ee.setMaxListeners.apply(this.ee, [n]); };
    Dispatcher.prototype.eventNames = function () { return this.ee.eventNames.apply(this.ee, []); };
    __decorate([
        lazyInject('cli.log'),
        __metadata("design:type", Object)
    ], Dispatcher.prototype, "log", void 0);
    Dispatcher = __decorate([
        singleton('cli.events'),
        __metadata("design:paramtypes", [])
    ], Dispatcher);
    return Dispatcher;
}());
export { Dispatcher };
