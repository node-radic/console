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
import { container } from "./Container";
var Event = (function () {
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
    return Event;
}());
export { Event };
var HaltEvent = (function (_super) {
    __extends(HaltEvent, _super);
    function HaltEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.halt = false;
        return _this;
    }
    HaltEvent.prototype.stop = function () { this.halt = true; };
    return HaltEvent;
}(Event));
export { HaltEvent };
var CliStartEvent = (function (_super) {
    __extends(CliStartEvent, _super);
    function CliStartEvent(requiredPath) {
        var _this = _super.call(this, 'cli:start') || this;
        _this.requiredPath = requiredPath;
        return _this;
    }
    return CliStartEvent;
}(HaltEvent));
export { CliStartEvent };
var CliParseEvent = (function (_super) {
    __extends(CliParseEvent, _super);
    function CliParseEvent(config, globals) {
        var _this = _super.call(this, 'cli:parse') || this;
        _this.config = config;
        _this.globals = globals;
        return _this;
    }
    return CliParseEvent;
}(HaltEvent));
export { CliParseEvent };
var CliParsedEvent = (function (_super) {
    __extends(CliParsedEvent, _super);
    function CliParsedEvent(config, argv, globals) {
        var _this = _super.call(this, 'cli:parsed') || this;
        _this.config = config;
        _this.argv = argv;
        _this.globals = globals;
        return _this;
    }
    return CliParsedEvent;
}(HaltEvent));
export { CliParsedEvent };
var CliSpawnEvent = (function (_super) {
    __extends(CliSpawnEvent, _super);
    function CliSpawnEvent(args, file, proc) {
        var _this = _super.call(this, 'cli:spawn') || this;
        _this.args = args;
        _this.file = file;
        _this.proc = proc;
        return _this;
    }
    return CliSpawnEvent;
}(HaltEvent));
export { CliSpawnEvent };
var CliExecuteCommandParseEvent = (function (_super) {
    __extends(CliExecuteCommandParseEvent, _super);
    function CliExecuteCommandParseEvent(config, options) {
        var _this = _super.call(this, 'cli:execute:parse') || this;
        _this.config = config;
        _this.options = options;
        return _this;
    }
    return CliExecuteCommandParseEvent;
}(HaltEvent));
export { CliExecuteCommandParseEvent };
var CliExecuteCommandParsedEvent = (function (_super) {
    __extends(CliExecuteCommandParsedEvent, _super);
    function CliExecuteCommandParsedEvent(argv, config, options) {
        var _this = _super.call(this, 'cli:execute:parsed') || this;
        _this.argv = argv;
        _this.config = config;
        _this.options = options;
        return _this;
    }
    return CliExecuteCommandParsedEvent;
}(HaltEvent));
export { CliExecuteCommandParsedEvent };
var CliExecuteCommandInvalidArgumentsEvent = (function (_super) {
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
}(HaltEvent));
export { CliExecuteCommandInvalidArgumentsEvent };
var CliExecuteCommandHandleEvent = (function (_super) {
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
}(HaltEvent));
export { CliExecuteCommandHandleEvent };
var CliExecuteCommandHandledEvent = (function (_super) {
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
}(HaltEvent));
export { CliExecuteCommandHandledEvent };
var HelpersStartingEvent = (function (_super) {
    __extends(HelpersStartingEvent, _super);
    function HelpersStartingEvent(helpers, enabledHelpers, customConfigs) {
        var _this = _super.call(this, 'helpers:starting') || this;
        _this.helpers = helpers;
        _this.enabledHelpers = enabledHelpers;
        _this.customConfigs = customConfigs;
        return _this;
    }
    return HelpersStartingEvent;
}(HaltEvent));
export { HelpersStartingEvent };
var HelperStartingEvent = (function (_super) {
    __extends(HelperStartingEvent, _super);
    function HelperStartingEvent(helpers, name, customConfig) {
        var _this = _super.call(this, 'helper:starting') || this;
        _this.helpers = helpers;
        _this.name = name;
        _this.customConfig = customConfig;
        return _this;
    }
    return HelperStartingEvent;
}(HaltEvent));
export { HelperStartingEvent };
var HelperStartedEvent = (function (_super) {
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
var HelpersStartedEvent = (function (_super) {
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
