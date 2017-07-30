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
var Helpers = (function () {
    function Helpers() {
        this._startedHelpers = [];
        this._helpers = {};
        this.started = false;
    }
    Helpers.prototype.addHelper = function (options) {
        options = _.merge(defaults.helper(), options);
        this.config.set('helpers.' + options.name, options.config);
        return this._helpers[options.name] = options;
    };
    Helpers.prototype.enableHelper = function (name, customConfig) {
        if (customConfig === void 0) { customConfig = {}; }
        this._helpers[name].enabled = true;
        var config = this.config.get('helpers.' + name);
        config = _.merge({}, config, customConfig);
        this.config.set('helpers.' + name, config);
        var a = this.config.get('enabledHelpers', []);
        this.config.set('enabledHelpers', a.concat([name]));
    };
    Helpers.prototype.startHelpers = function (customConfigs) {
        var _this = this;
        if (customConfigs === void 0) { customConfigs = {}; }
        var enabledHelpers = this.config.get('enabledHelpers', []);
        if (this.started === false) {
            if (this.events.fire(new HelpersStartingEvent(this, enabledHelpers, customConfigs)).halt) {
                return;
            }
        }
        enabledHelpers.forEach(function (name) {
            if (_this.events.fire(new HelperStartingEvent(_this, name, customConfigs[name] || {})).halt) {
                return;
            }
            _this.startHelper(name, customConfigs[name] || {});
            _this.events.fire(new HelperStartedEvent(_this, name));
        });
        if (this.started === false) {
            this.events.fire(new HelpersStartedEvent(this, enabledHelpers));
        }
        this.started = true;
    };
    Helpers.prototype.startHelper = function (name, customConfig) {
        var _this = this;
        if (customConfig === void 0) { customConfig = {}; }
        var options = this._helpers[name];
        if (this._startedHelpers.includes(name)) {
            return;
        }
        this._startedHelpers.push(name);
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
        container.ensureInjectable(options.cls);
        options.binding = container.bind(bindingName).to(options.cls);
        if (options.singleton) {
            options.binding.inSingletonScope();
        }
        options.binding.onActivation(function (ctx, helperClass) {
            helperClass[options.configKey] = _this.config('helpers.' + options.name);
            return helperClass;
        });
        var instance;
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
        lazyInject('cli.config'),
        __metadata("design:type", Function)
    ], Helpers.prototype, "config", void 0);
    Helpers = __decorate([
        singleton('cli.helpers')
    ], Helpers);
    return Helpers;
}());
export { Helpers };
