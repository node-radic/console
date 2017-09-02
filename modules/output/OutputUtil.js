"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var radical_console_1 = require("radical-console");
var console_colors_1 = require("@radic/console-colors");
var truncate = require("cli-truncate");
var wrap = require("wrap-ansi");
var slice = require("slice-ansi");
var widest = require("widest-line");
var width = require("string-width");
var OutputUtil = /** @class */ (function () {
    function OutputUtil(output) {
        this.output = output;
        this._useColors = true;
        this._parser = new console_colors_1.Parser;
    }
    Object.defineProperty(OutputUtil.prototype, "parser", {
        get: function () { return this._parser; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OutputUtil.prototype, "colors", {
        get: function () { return this._parser.colors; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OutputUtil.prototype, "useColors", {
        get: function () { return this._useColors; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OutputUtil.prototype, "figures", {
        get: function () { return radical_console_1.figures; },
        enumerable: true,
        configurable: true
    });
    OutputUtil.prototype.disableColors = function () {
        this._useColors = false;
        return this;
    };
    OutputUtil.prototype.enableColors = function () {
        this._useColors = true;
        return this;
    };
    OutputUtil.prototype.parse = function (text, force) { return this._parser.parse(text); };
    OutputUtil.prototype.clean = function (text) { return this._parser.clean(text); };
    OutputUtil.prototype.truncate = function (input, columns, options) { return truncate.apply(truncate, arguments); };
    OutputUtil.prototype.wrap = function (input, columns, options) { return wrap.apply(wrap, arguments); };
    OutputUtil.prototype.slice = function (inputu, beginSlice, endSlice) { return slice.apply(slice, arguments); };
    OutputUtil.prototype.widest = function (input) { return widest.apply(widest, arguments); };
    OutputUtil.prototype.width = function (input) { return width.apply(width, arguments); };
    return OutputUtil;
}());
exports.OutputUtil = OutputUtil;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3V0cHV0VXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIk91dHB1dFV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxtREFBeUM7QUFDekMsd0RBQXNEO0FBQ3RELHVDQUF3QztBQUN4QyxnQ0FBaUM7QUFDakMsa0NBQW1DO0FBQ25DLG9DQUFxQztBQUNyQyxvQ0FBcUM7QUFFckM7SUFZSSxvQkFBc0IsTUFBZTtRQUFmLFdBQU0sR0FBTixNQUFNLENBQVM7UUFYM0IsZUFBVSxHQUFZLElBQUksQ0FBQztRQVdJLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSx1QkFBTSxDQUFBO0lBQUMsQ0FBQztJQVJwRSxzQkFBSSw4QkFBTTthQUFWLGNBQXVCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFBLENBQUMsQ0FBQzs7O09BQUE7SUFFNUMsc0JBQUksOEJBQU07YUFBVixjQUF1QixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDOzs7T0FBQTtJQUVwRCxzQkFBSSxpQ0FBUzthQUFiLGNBQTBCLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFBLENBQUEsQ0FBQzs7O09BQUE7SUFFakQsc0JBQUksK0JBQU87YUFBWCxjQUF5QixNQUFNLENBQUMseUJBQU8sQ0FBQSxDQUFBLENBQUM7OztPQUFBO0lBSXhDLGtDQUFhLEdBQWI7UUFDSSxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztRQUN4QixNQUFNLENBQUMsSUFBSSxDQUFBO0lBQ2YsQ0FBQztJQUVELGlDQUFZLEdBQVo7UUFDSSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUN2QixNQUFNLENBQUMsSUFBSSxDQUFBO0lBQ2YsQ0FBQztJQUVELDBCQUFLLEdBQUwsVUFBTSxJQUFZLEVBQUUsS0FBZSxJQUFXLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQSxDQUFDLENBQUM7SUFFL0UsMEJBQUssR0FBTCxVQUFNLElBQVksSUFBWSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUEsQ0FBQSxDQUFDO0lBRTlELDZCQUFRLEdBQVIsVUFBUyxLQUFhLEVBQUUsT0FBZSxFQUFFLE9BQXlCLElBQVksTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFBLENBQUEsQ0FBQztJQUV6SCx5QkFBSSxHQUFKLFVBQUssS0FBYSxFQUFFLE9BQWUsRUFBRSxPQUFxQixJQUFZLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQSxDQUFBLENBQUM7SUFFekcsMEJBQUssR0FBTCxVQUFNLE1BQWMsRUFBRSxVQUFrQixFQUFFLFFBQWlCLElBQVksTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFBLENBQUEsQ0FBQztJQUU1RywyQkFBTSxHQUFOLFVBQU8sS0FBYSxJQUFZLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQSxDQUFBLENBQUM7SUFFdkUsMEJBQUssR0FBTCxVQUFNLEtBQWEsSUFBWSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUEsQ0FBQSxDQUFDO0lBR3hFLGlCQUFDO0FBQUQsQ0FBQyxBQXZDRCxJQXVDQztBQXZDWSxnQ0FBVSJ9