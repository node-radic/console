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
const core_1 = require("../core");
let ParsedOptionsDefinition = class ParsedOptionsDefinition {
    constructor() {
        this.help = { enabled: false, show: false, key: undefined };
        this.options = {};
        this.errors = [];
    }
    hasOpt(n) {
        return !this.options[n] === false;
    }
    get nopts() {
        return Object.keys(this.options).length;
    }
    opt(n) {
        if (false === this.hasOpt(n))
            return false;
        return this.options[n];
    }
    hasErrors() {
        return this.errors.length > 0;
    }
};
ParsedOptionsDefinition = __decorate([
    core_1.injectable(), 
    __metadata('design:paramtypes', [])
], ParsedOptionsDefinition);
exports.ParsedOptionsDefinition = ParsedOptionsDefinition;
let ParsedArgumentsDefinition = class ParsedArgumentsDefinition extends ParsedOptionsDefinition {
    constructor(...args) {
        super(...args);
        this.arguments = {};
    }
    get nargs() {
        return Object.keys(this.arguments).length;
    }
    hasArg(n) {
        return !this.arguments[n] === false;
    }
    arg(n) {
        return this.hasArg(n) ? this.arguments[n] : this.definition.getArguments()[n].default;
    }
};
ParsedArgumentsDefinition = __decorate([
    core_1.injectable(), 
    __metadata('design:paramtypes', [])
], ParsedArgumentsDefinition);
exports.ParsedArgumentsDefinition = ParsedArgumentsDefinition;
let ParsedCommandsDefinition = class ParsedCommandsDefinition extends ParsedOptionsDefinition {
    constructor(...args) {
        super(...args);
        this.isRoot = false;
        this.isCommand = false;
        this.isGroup = false;
    }
};
ParsedCommandsDefinition = __decorate([
    core_1.injectable(), 
    __metadata('design:paramtypes', [])
], ParsedCommandsDefinition);
exports.ParsedCommandsDefinition = ParsedCommandsDefinition;
//# sourceMappingURL=parsed.js.map