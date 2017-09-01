var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { container, injectable } from "./Container";
var Event = /** @class */ (function () {
    function Event(event) {
        if (event === void 0) { event = undefined; }
        this.event = event;
    }
    Object.defineProperty(Event.prototype, "cli", {
        get: function () {
            return container.get('cli');
        },
        enumerable: true,
        configurable: true
    });
    Event = __decorate([
        injectable(),
        __metadata("design:paramtypes", [Object])
    ], Event);
    return Event;
}());
export { Event };
var ExitEvent = /** @class */ (function (_super) {
    __extends(ExitEvent, _super);
    function ExitEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._exit = false;
        _this._exitCode = 0;
        return _this;
    }
    ExitEvent.prototype.exit = function (code) {
        if (code === void 0) { code = 0; }
        this._exit = true;
        this._exitCode = code;
    };
    ExitEvent.prototype.stopIfExit = function () {
        if (this._exit) {
            process.exit(this._exitCode);
        }
        return this;
    };
    ExitEvent.prototype.shouldExit = function () { return this._exit; };
    ExitEvent = __decorate([
        injectable()
    ], ExitEvent);
    return ExitEvent;
}(Event));
export { ExitEvent };
var CancelEvent = /** @class */ (function (_super) {
    __extends(CancelEvent, _super);
    function CancelEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._canceled = false;
        return _this;
    }
    CancelEvent.prototype.cancel = function () {
        this._canceled = true;
    };
    CancelEvent.prototype.canceled = function (cb) {
        if (this._canceled === true) {
            return cb(this);
        }
        return this;
    };
    CancelEvent.prototype.proceed = function (cb) {
        if (this._canceled === false) {
            cb();
        }
        return this;
    };
    CancelEvent.prototype.isCanceled = function () { return this._canceled; };
    CancelEvent = __decorate([
        injectable()
    ], CancelEvent);
    return CancelEvent;
}(Event));
export { CancelEvent };
var CancelExitEvent = /** @class */ (function (_super) {
    __extends(CancelExitEvent, _super);
    function CancelExitEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._canceled = false;
        return _this;
    }
    CancelExitEvent.prototype.cancel = function () {
        this._canceled = true;
    };
    CancelExitEvent.prototype.canceled = function (cb) {
        if (this._canceled === true) {
            cb();
        }
        return this;
    };
    CancelExitEvent.prototype.proceed = function (cb) {
        if (this._canceled === false) {
            cb();
        }
        return this;
    };
    CancelExitEvent.prototype.isCanceled = function () { return this._canceled; };
    CancelExitEvent = __decorate([
        injectable()
    ], CancelExitEvent);
    return CancelExitEvent;
}(ExitEvent));
export { CancelExitEvent };
var CliStartEvent = /** @class */ (function (_super) {
    __extends(CliStartEvent, _super);
    function CliStartEvent(requiredPath) {
        var _this = _super.call(this, 'cli:start') || this;
        _this.requiredPath = requiredPath;
        return _this;
    }
    return CliStartEvent;
}(CancelEvent));
export { CliStartEvent };
var CliParseEvent = /** @class */ (function (_super) {
    __extends(CliParseEvent, _super);
    function CliParseEvent(config, globals, isRootCommand) {
        var _this = _super.call(this, 'cli:parse') || this;
        _this.config = config;
        _this.globals = globals;
        _this.isRootCommand = isRootCommand;
        return _this;
    }
    return CliParseEvent;
}(CancelExitEvent));
export { CliParseEvent };
var CliParsedEvent = /** @class */ (function (_super) {
    __extends(CliParsedEvent, _super);
    function CliParsedEvent(config, globals, isRootCommand, argv) {
        var _this = _super.call(this, 'cli:parsed') || this;
        _this.config = config;
        _this.globals = globals;
        _this.isRootCommand = isRootCommand;
        _this.argv = argv;
        return _this;
    }
    return CliParsedEvent;
}(ExitEvent));
export { CliParsedEvent };
var CliSpawnEvent = /** @class */ (function (_super) {
    __extends(CliSpawnEvent, _super);
    function CliSpawnEvent(args, file, proc) {
        var _this = _super.call(this, 'cli:spawn') || this;
        _this.args = args;
        _this.file = file;
        _this.proc = proc;
        return _this;
    }
    return CliSpawnEvent;
}(ExitEvent));
export { CliSpawnEvent };
var CliExecuteCommandEvent = /** @class */ (function (_super) {
    __extends(CliExecuteCommandEvent, _super);
    function CliExecuteCommandEvent(config, alwaysRun) {
        var _this = _super.call(this, 'cli:execute') || this;
        _this.config = config;
        _this.alwaysRun = alwaysRun;
        return _this;
    }
    return CliExecuteCommandEvent;
}(CancelEvent));
export { CliExecuteCommandEvent };
var CliExecuteCommandParseEvent = /** @class */ (function (_super) {
    __extends(CliExecuteCommandParseEvent, _super);
    function CliExecuteCommandParseEvent(config, options) {
        var _this = _super.call(this, 'cli:execute:parse') || this;
        _this.config = config;
        _this.options = options;
        return _this;
    }
    return CliExecuteCommandParseEvent;
}(ExitEvent));
export { CliExecuteCommandParseEvent };
var CliExecuteCommandParsedEvent = /** @class */ (function (_super) {
    __extends(CliExecuteCommandParsedEvent, _super);
    function CliExecuteCommandParsedEvent(argv, config, options) {
        var _this = _super.call(this, 'cli:execute:parsed') || this;
        _this.argv = argv;
        _this.config = config;
        _this.options = options;
        return _this;
    }
    return CliExecuteCommandParsedEvent;
}(ExitEvent));
export { CliExecuteCommandParsedEvent };
var CliExecuteCommandInvalidArgumentsEvent = /** @class */ (function (_super) {
    __extends(CliExecuteCommandInvalidArgumentsEvent, _super);
    function CliExecuteCommandInvalidArgumentsEvent(instance, parsed, config, options) {
        var _this = _super.call(this, 'cli:execute:invalid') || this;
        _this.instance = instance;
        _this.parsed = parsed;
        _this.config = config;
        _this.options = options;
        return _this;
    }
    return CliExecuteCommandInvalidArgumentsEvent;
}(ExitEvent));
export { CliExecuteCommandInvalidArgumentsEvent };
var CliExecuteCommandHandleEvent = /** @class */ (function (_super) {
    __extends(CliExecuteCommandHandleEvent, _super);
    function CliExecuteCommandHandleEvent(instance, parsed, argv, config, options) {
        var _this = _super.call(this, 'cli:execute:handle') || this;
        _this.instance = instance;
        _this.parsed = parsed;
        _this.argv = argv;
        _this.config = config;
        _this.options = options;
        return _this;
    }
    return CliExecuteCommandHandleEvent;
}(ExitEvent));
export { CliExecuteCommandHandleEvent };
var CliExecuteCommandHandledEvent = /** @class */ (function (_super) {
    __extends(CliExecuteCommandHandledEvent, _super);
    function CliExecuteCommandHandledEvent(result, instance, argv, config, options) {
        var _this = _super.call(this, 'cli:execute:handled') || this;
        _this.result = result;
        _this.instance = instance;
        _this.argv = argv;
        _this.config = config;
        _this.options = options;
        return _this;
    }
    return CliExecuteCommandHandledEvent;
}(ExitEvent));
export { CliExecuteCommandHandledEvent };
var CliPluginRegisterEvent = /** @class */ (function (_super) {
    __extends(CliPluginRegisterEvent, _super);
    function CliPluginRegisterEvent(plugin, config) {
        var _this = _super.call(this, 'cli:plugin:register') || this;
        _this.plugin = plugin;
        _this.config = config;
        return _this;
    }
    return CliPluginRegisterEvent;
}(CancelEvent));
export { CliPluginRegisterEvent };
var CliPluginRegisteredEvent = /** @class */ (function (_super) {
    __extends(CliPluginRegisteredEvent, _super);
    function CliPluginRegisteredEvent(plugin) {
        var _this = _super.call(this, 'cli:plugins:registered') || this;
        _this.plugin = plugin;
        return _this;
    }
    return CliPluginRegisteredEvent;
}(Event));
export { CliPluginRegisteredEvent };
var HelpersStartingEvent = /** @class */ (function (_super) {
    __extends(HelpersStartingEvent, _super);
    function HelpersStartingEvent(helpers, enabledHelpers) {
        var _this = _super.call(this, 'helpers:starting') || this;
        _this.helpers = helpers;
        _this.enabledHelpers = enabledHelpers;
        return _this;
    }
    return HelpersStartingEvent;
}(CancelEvent));
export { HelpersStartingEvent };
var HelperStartingEvent = /** @class */ (function (_super) {
    __extends(HelperStartingEvent, _super);
    function HelperStartingEvent(helpers, name) {
        var _this = _super.call(this, 'helper:starting') || this;
        _this.helpers = helpers;
        _this.name = name;
        return _this;
    }
    return HelperStartingEvent;
}(CancelEvent));
export { HelperStartingEvent };
var HelperStartedEvent = /** @class */ (function (_super) {
    __extends(HelperStartedEvent, _super);
    function HelperStartedEvent(helpers, name) {
        var _this = _super.call(this, 'helper:started') || this;
        _this.helpers = helpers;
        _this.name = name;
        return _this;
    }
    return HelperStartedEvent;
}(Event));
export { HelperStartedEvent };
var HelpersStartedEvent = /** @class */ (function (_super) {
    __extends(HelpersStartedEvent, _super);
    function HelpersStartedEvent(helpers, startedHelpers) {
        var _this = _super.call(this, 'helpers:started') || this;
        _this.helpers = helpers;
        _this.startedHelpers = startedHelpers;
        return _this;
    }
    return HelpersStartedEvent;
}(Event));
export { HelpersStartedEvent };
