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
var src_1 = require("../../src");
var SebGroup = (function (_super) {
    __extends(SebGroup, _super);
    function SebGroup() {
        _super.apply(this, arguments);
    }
    SebGroup = __decorate([
        src_1.group('seb', 'Seb commands', 'Provides commands for seb'), 
        __metadata('design:paramtypes', [])
    ], SebGroup);
    return SebGroup;
}(src_1.Group));
exports.SebGroup = SebGroup;
var ShowSebCommand = (function (_super) {
    __extends(ShowSebCommand, _super);
    function ShowSebCommand() {
        _super.apply(this, arguments);
    }
    ShowSebCommand.prototype.handle = function () {
        var color = this.opt('g') ? 'green' : 'yellow';
        this.line("This is the {" + color + "}show {bold}seb{/" + color + "} command{/bold}");
    };
    ShowSebCommand = __decorate([
        src_1.command('show', 'Show Seb', 'Show this seb', SebGroup), 
        __metadata('design:paramtypes', [])
    ], ShowSebCommand);
    return ShowSebCommand;
}(src_1.Command));
exports.ShowSebCommand = ShowSebCommand;
//# sourceMappingURL=seb.js.map