"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var radical_console_1 = require("radical-console");
var truncate = require("cli-truncate");
var wrap = require("wrap-ansi");
var slice = require("slice-ansi");
var widest = require("widest-line");
var width = require("string-width");
var OutputUtil = /** @class */ (function () {
    function OutputUtil(output) {
        this.output = output;
    }
    Object.defineProperty(OutputUtil.prototype, "useColors", {
        get: function () { return this.output.options.colors; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OutputUtil.prototype, "figures", {
        get: function () { return radical_console_1.figures; },
        enumerable: true,
        configurable: true
    });
    OutputUtil.prototype.truncate = function (input, columns, options) { return truncate.apply(truncate, arguments); };
    OutputUtil.prototype.wrap = function (input, columns, options) { return wrap.apply(wrap, arguments); };
    OutputUtil.prototype.slice = function (inputu, beginSlice, endSlice) { return slice.apply(slice, arguments); };
    OutputUtil.prototype.widest = function (input) { return widest.apply(widest, arguments); };
    OutputUtil.prototype.width = function (input) { return width.apply(width, arguments); };
    return OutputUtil;
}());
exports.OutputUtil = OutputUtil;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3V0cHV0VXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIk91dHB1dFV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtREFBeUM7QUFFekMsdUNBQXdDO0FBQ3hDLGdDQUFpQztBQUNqQyxrQ0FBbUM7QUFDbkMsb0NBQXFDO0FBQ3JDLG9DQUFxQztBQUtyQztJQU1JLG9CQUFzQixNQUFjO1FBQWQsV0FBTSxHQUFOLE1BQU0sQ0FBUTtJQUFLLENBQUM7SUFKMUMsc0JBQUksaUNBQVM7YUFBYixjQUEwQixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFBLENBQUMsQ0FBQzs7O09BQUE7SUFFN0Qsc0JBQUksK0JBQU87YUFBWCxjQUF5QixNQUFNLENBQUMseUJBQU8sQ0FBQSxDQUFBLENBQUM7OztPQUFBO0lBSXhDLDZCQUFRLEdBQVIsVUFBUyxLQUFhLEVBQUUsT0FBZSxFQUFFLE9BQXlCLElBQVksTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFBLENBQUEsQ0FBQztJQUV6SCx5QkFBSSxHQUFKLFVBQUssS0FBYSxFQUFFLE9BQWUsRUFBRSxPQUFxQixJQUFZLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQSxDQUFBLENBQUM7SUFFekcsMEJBQUssR0FBTCxVQUFNLE1BQWMsRUFBRSxVQUFrQixFQUFFLFFBQWlCLElBQVksTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFBLENBQUEsQ0FBQztJQUU1RywyQkFBTSxHQUFOLFVBQU8sS0FBYSxJQUFZLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQSxDQUFBLENBQUM7SUFFdkUsMEJBQUssR0FBTCxVQUFNLEtBQWEsSUFBWSxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUEsQ0FBQSxDQUFDO0lBR3hFLGlCQUFDO0FBQUQsQ0FBQyxBQW5CRCxJQW1CQztBQW5CWSxnQ0FBVSJ9