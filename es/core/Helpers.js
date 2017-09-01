var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { defaults } from "../defaults";
import { container, inject, lazyInject, singleton } from "./Container";
import { kindOf } from "@radic/util";
import * as _ from "lodash";
import { Dispatcher } from "./Dispatcher";
import { HelpersStartedEvent, HelpersStartingEvent, HelperStartedEvent, HelperStartingEvent } from "./events";
var Helpers = /** @class */ (function () {
    function Helpers() {
        this._startedHelpers = [];
        this._helpers = {};
        this.started = false;
    }
    Helpers.prototype.has = function (name) { return !!this._helpers[name]; };
    Helpers.prototype.isEnabled = function (name) { return this._helpers[name].enabled === true; };
    Helpers.prototype.add = function (options) {
        options = _.merge(defaults.helper(), options);
        this.config.set('helpers.' + options.name, options.config);
        return this._helpers[options.name] = options;
    };
    Helpers.prototype.enable = function (name, customConfig) {
        if (customConfig === void 0) { customConfig = {}; }
        this._helpers[name].enabled = true;
        var config = this.config.get('helpers.' + name);
        config = _.merge({}, config, customConfig);
        this.config.set('helpers.' + name, config);
        var a = this.config.get('enabledHelpers', []);
        this.config.set('enabledHelpers', a.concat([name]));
        if (this.started) {
            this.startHelper(name);
        }
    };
    Helpers.prototype.startHelpers = function () {
        var _this = this;
        var enabledHelpers = this.config.get('enabledHelpers', []);
        if (this.started === false) {
            if (this.events.fire(new HelpersStartingEvent(this, enabledHelpers)).isCanceled())
                return;
        }
        enabledHelpers.forEach(function (name) {
            _this.events.fire(new HelperStartingEvent(_this, name)).proceed(function () {
                _this.startHelper(name);
                _this.events.fire(new HelperStartedEvent(_this, name));
            });
        });
        if (this.started === false) {
            this.events.fire(new HelpersStartedEvent(this, enabledHelpers));
        }
        this.started = true;
    };
    /** some helpers can/need to be enabled before usage **/
    Helpers.prototype.startHelper = function (name, customConfig) {
        var _this = this;
        if (customConfig === void 0) { customConfig = {}; }
        var options = this._helpers[name];
        if (this._startedHelpers.includes(name)) {
            return;
        }
        this._startedHelpers.push(name);
        // start dependency helpers
        if (options.depends.length > 0) {
            options.depends.forEach(function (depend) {
                if (!Object.keys(_this._helpers).includes(depend)) {
                    if (!options.enableDepends) {
                        throw new Error("Cannot start helper [" + name + "]. It depends on [" + depend + "]. Either enable it or set config [helpers." + name + ".enableDepends] to [true]");
                    }
                    _this.startHelper(depend);
                }
            });
        }
        var bindingName = 'cli.helpers.' + options.name;
        // bind the helper into the container, if needed as singleton
        // if ( container.isBound(bindingName) ) {
        container.ensureInjectable(options.cls);
        options.binding = container.bind(bindingName).to(options.cls);
        if (options.singleton) {
            options.binding.inSingletonScope();
        }
        options.binding.onActivation(function (ctx, helperClass) {
            // console.dir(ctx.plan, {depth: 50, colors: true }); //.plan.rootRequest.serviceIdentifier
            // process.exit();
            helperClass[options.configKey] = _this.config('helpers.' + options.name);
            return helperClass;
        });
        this.log.debug('started helper ' + name);
        var instance;
        // add the event listeners and bind them to the given function names
        // if ( container.isBound(bindingName) ) {
        //     return;
        // }
        Object.keys(options.listeners).forEach(function (eventName) {
            var fnName = options.listeners[eventName];
            _this.events.once(eventName, function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                instance = instance || container.get(bindingName);
                if (kindOf(instance[fnName]) === 'function') {
                    instance[fnName].apply(instance, args);
                }
            });
        });
        this._helpers[name] = options;
    };
    __decorate([
        inject('cli.events'),
        __metadata("design:type", Dispatcher)
    ], Helpers.prototype, "events", void 0);
    __decorate([
        lazyInject('cli.log'),
        __metadata("design:type", Object)
    ], Helpers.prototype, "log", void 0);
    __decorate([
        lazyInject('cli.config'),
        __metadata("design:type", Function)
    ], Helpers.prototype, "config", void 0);
    Helpers = __decorate([
        singleton('cli.helpers')
    ], Helpers);
    return Helpers;
}());
export { Helpers };
