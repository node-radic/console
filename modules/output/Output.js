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
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("util");
var src_1 = require("../../src");
var OutputUtil_1 = require("./OutputUtil");
var Output = /** @class */ (function () {
    function Output() {
        var _this = this;
        this.stdout = process.stdout;
        this._options = {
            enabled: true,
            colors: true,
            inspect: { showHidden: true, depth: 10 }
        };
        this.writeln = function (text) {
            if (text === void 0) { text = ''; }
            return _this.write(text + '\n');
        };
        this.line = function (text) {
            if (text === void 0) { text = ''; }
            return _this.write(text + '\n');
        };
        this.dump = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            _this._options.inspect.colors = _this._options.colors;
            args.forEach(function (arg) { return _this.line(util_1.inspect(arg, _this._options.inspect)); });
            return _this;
        };
        this.diff = function (o, o2) { return new src_1.Diff(o, o2); };
        this.spinner = function (text) { return src_1.requirePeer('ora'); };
        this.util = new OutputUtil_1.OutputUtil(this);
    }
    Object.defineProperty(Output.prototype, "options", {
        get: function () { return this._options; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Output.prototype, "nl", {
        get: function () { return this.write('\n'); },
        enumerable: true,
        configurable: true
    });
    Output.prototype.write = function (text) {
        this.stdout.write(text);
        return this;
    };
    Output.prototype.macro = function (name) {
        var _this = this;
        return (function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return _this.macros[name].apply(_this, args);
        });
    };
    Output.prototype.setMacro = function (name, macro) {
        this.macros[name] = macro;
        return this;
    };
    Output.prototype.beep = function (val, cb) {
        src_1.requirePeer('beeper')(val);
        return this;
    };
    Output.prototype.tree = function (obj, prefix, opts) {
        var tree = src_1.requirePeer('archy')(obj, prefix, opts);
        return this.line(tree);
    };
    Output = __decorate([
        src_1.singleton('cli.output'),
        __metadata("design:paramtypes", [])
    ], Output);
    return Output;
}());
exports.Output = Output;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3V0cHV0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiT3V0cHV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQ0EsNkJBQStDO0FBQy9DLGlDQUF5RDtBQUN6RCwyQ0FBeUM7QUFHekM7SUFjSTtRQUFBLGlCQUFtRDtRQVo1QyxXQUFNLEdBQXVCLE9BQU8sQ0FBQyxNQUFNLENBQUE7UUFFeEMsYUFBUSxHQUFrQjtZQUNoQyxPQUFPLEVBQUUsSUFBSTtZQUNiLE1BQU0sRUFBRyxJQUFJO1lBQ2IsT0FBTyxFQUFFLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFO1NBQzNDLENBQUE7UUFhRCxZQUFPLEdBQUcsVUFBQyxJQUFpQjtZQUFqQixxQkFBQSxFQUFBLFNBQWlCO1lBQVcsT0FBQSxLQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFBdkIsQ0FBdUIsQ0FBQTtRQUU5RCxTQUFJLEdBQUcsVUFBQyxJQUFpQjtZQUFqQixxQkFBQSxFQUFBLFNBQWlCO1lBQVcsT0FBQSxLQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFBdkIsQ0FBdUIsQ0FBQTtRQUUzRCxTQUFJLEdBQUc7WUFBQyxjQUFjO2lCQUFkLFVBQWMsRUFBZCxxQkFBYyxFQUFkLElBQWM7Z0JBQWQseUJBQWM7O1lBQ2xCLEtBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxLQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQTtZQUNuRCxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQUEsR0FBRyxJQUFJLE9BQUEsS0FBSSxDQUFDLElBQUksQ0FBQyxjQUFPLENBQUMsR0FBRyxFQUFFLEtBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBOUMsQ0FBOEMsQ0FBQyxDQUFDO1lBQ3BFLE1BQU0sQ0FBQyxLQUFJLENBQUE7UUFDZixDQUFDLENBQUE7UUFhRCxTQUFJLEdBQUcsVUFBQyxDQUFTLEVBQUUsRUFBVSxJQUFXLE9BQUEsSUFBSSxVQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxFQUFmLENBQWUsQ0FBQTtRQUV2RCxZQUFPLEdBQUcsVUFBQyxJQUFhLElBQWMsT0FBQSxpQkFBVyxDQUFVLEtBQUssQ0FBQyxFQUEzQixDQUEyQixDQUFBO1FBOUJqRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksdUJBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUFDLENBQUM7SUFKbkQsc0JBQUksMkJBQU87YUFBWCxjQUErQixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQSxDQUFBLENBQUM7OztPQUFBO0lBRXBELHNCQUFJLHNCQUFFO2FBQU4sY0FBaUIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUEsQ0FBQyxDQUFDOzs7T0FBQTtJQUkxQyxzQkFBSyxHQUFMLFVBQU0sSUFBWTtRQUNkLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQVlELHNCQUFLLEdBQUwsVUFBNEMsSUFBWTtRQUF4RCxpQkFJQztRQUhHLE1BQU0sQ0FBSyxDQUFDO1lBQUMsY0FBYztpQkFBZCxVQUFjLEVBQWQscUJBQWMsRUFBZCxJQUFjO2dCQUFkLHlCQUFjOztZQUN2QixNQUFNLENBQUMsS0FBSSxDQUFDLE1BQU0sQ0FBRSxJQUFJLENBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSSxFQUFFLElBQUksQ0FBQyxDQUFBO1FBQ2hELENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUVELHlCQUFRLEdBQVIsVUFBK0MsSUFBWSxFQUFFLEtBQVM7UUFDbEUsSUFBSSxDQUFDLE1BQU0sQ0FBRSxJQUFJLENBQUUsR0FBRyxLQUFLLENBQUM7UUFDNUIsTUFBTSxDQUFDLElBQUksQ0FBQTtJQUNmLENBQUM7SUFRRCxxQkFBSSxHQUFKLFVBQUssR0FBWSxFQUFFLEVBQWE7UUFDNUIsaUJBQVcsQ0FBVyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNwQyxNQUFNLENBQUMsSUFBSSxDQUFBO0lBQ2YsQ0FBQztJQUVELHFCQUFJLEdBQUosVUFBSyxHQUFhLEVBQUUsTUFBZSxFQUFFLElBQWtCO1FBQ25ELElBQUksSUFBSSxHQUFHLGlCQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNuRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBeERRLE1BQU07UUFEbEIsZUFBUyxDQUFDLFlBQVksQ0FBQzs7T0FDWCxNQUFNLENBeURsQjtJQUFELGFBQUM7Q0FBQSxBQXpERCxJQXlEQztBQXpEWSx3QkFBTSJ9