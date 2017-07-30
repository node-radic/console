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
import { HaltEvent } from "../core/events";
var HelpHelperOnInvalidArgumentsShowHelpEvent = (function (_super) {
    __extends(HelpHelperOnInvalidArgumentsShowHelpEvent, _super);
    function HelpHelperOnInvalidArgumentsShowHelpEvent(parentEvent) {
        var _this = _super.call(this, 'helper:help:on-invalid-arguments:show-help') || this;
        _this.parentEvent = parentEvent;
        return _this;
    }
    return HelpHelperOnInvalidArgumentsShowHelpEvent;
}(HaltEvent));
export { HelpHelperOnInvalidArgumentsShowHelpEvent };
var HelpHelperShowHelpEvent = (function (_super) {
    __extends(HelpHelperShowHelpEvent, _super);
    function HelpHelperShowHelpEvent(config, options) {
        var _this = _super.call(this, 'helper:help:show-help') || this;
        _this.config = config;
        _this.options = options;
        return _this;
    }
    return HelpHelperShowHelpEvent;
}(HaltEvent));
export { HelpHelperShowHelpEvent };
