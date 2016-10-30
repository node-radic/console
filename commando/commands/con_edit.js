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
const src_1 = require("../../src");
const con_1 = require("./con");
let EditConnectionCommand = class EditConnectionCommand extends con_1.ConnectionCommand {
};
EditConnectionCommand = __decorate([
    src_1.command('edit', 'Edit connection', 'Edit a existing connection', con_1.ConnectionGroup), 
    __metadata('design:paramtypes', [])
], EditConnectionCommand);
exports.EditConnectionCommand = EditConnectionCommand;
//# sourceMappingURL=con_edit.js.map