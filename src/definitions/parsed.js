"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("../core");
var ParsedOptionsDefinition = (function () {
    function ParsedOptionsDefinition() {
        this.help = { enabled: false, show: false, key: undefined };
        this.options = {};
        this.errors = [];
    }
    ParsedOptionsDefinition.prototype.hasOpt = function (n) {
        return this.options[n] !== undefined;
    };
    Object.defineProperty(ParsedOptionsDefinition.prototype, "nopts", {
        get: function () {
            return Object.keys(this.options).length;
        },
        enumerable: true,
        configurable: true
    });
    ParsedOptionsDefinition.prototype.opt = function (n) {
        if (false === this.hasOpt(n))
            return false;
        return this.options[n];
    };
    ParsedOptionsDefinition.prototype.hasErrors = function () {
        return this.errors.length > 0;
    };
    ParsedOptionsDefinition = __decorate([
        core_1.injectable(), 
        __metadata('design:paramtypes', [])
    ], ParsedOptionsDefinition);
    return ParsedOptionsDefinition;
}());
exports.ParsedOptionsDefinition = ParsedOptionsDefinition;
var ParsedArgumentsDefinition = (function (_super) {
    __extends(ParsedArgumentsDefinition, _super);
    function ParsedArgumentsDefinition() {
        _super.apply(this, arguments);
        this.arguments = {};
    }
    Object.defineProperty(ParsedArgumentsDefinition.prototype, "nargs", {
        get: function () {
            return Object.keys(this.arguments).length;
        },
        enumerable: true,
        configurable: true
    });
    ParsedArgumentsDefinition.prototype.hasArg = function (n) {
        return this.arguments[n] !== null;
    };
    ParsedArgumentsDefinition.prototype.arg = function (n) {
        return this.hasArg(n) ? this.arguments[n] : this.definition.getArguments()[n].default;
    };
    ParsedArgumentsDefinition = __decorate([
        core_1.injectable(), 
        __metadata('design:paramtypes', [])
    ], ParsedArgumentsDefinition);
    return ParsedArgumentsDefinition;
}(ParsedOptionsDefinition));
exports.ParsedArgumentsDefinition = ParsedArgumentsDefinition;
var ParsedCommandsDefinition = (function (_super) {
    __extends(ParsedCommandsDefinition, _super);
    function ParsedCommandsDefinition() {
        _super.apply(this, arguments);
        this.isRoot = false;
        this.isCommand = false;
        this.isGroup = false;
    }
    ParsedCommandsDefinition = __decorate([
        core_1.injectable(), 
        __metadata('design:paramtypes', [])
    ], ParsedCommandsDefinition);
    return ParsedCommandsDefinition;
}(ParsedOptionsDefinition));
exports.ParsedCommandsDefinition = ParsedCommandsDefinition;
//# sourceMappingURL=parsed.js.map