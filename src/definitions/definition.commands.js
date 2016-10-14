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
var definition_options_1 = require("./definition.options");
var core_1 = require("../core");
var CommandsDefinition = (function (_super) {
    __extends(CommandsDefinition, _super);
    function CommandsDefinition() {
        _super.apply(this, arguments);
    }
    CommandsDefinition.prototype.getCommands = function () {
        return this.factory.commands;
    };
    CommandsDefinition.prototype.getGroups = function () {
        return this.factory.groups;
    };
    __decorate([
        core_1.inject(core_1.BINDINGS.COMMANDS_FACTORY), 
        __metadata('design:type', Object)
    ], CommandsDefinition.prototype, "factory", void 0);
    return CommandsDefinition;
}(definition_options_1.OptionsDefinition));
exports.CommandsDefinition = CommandsDefinition;
//# sourceMappingURL=definition.commands.js.map