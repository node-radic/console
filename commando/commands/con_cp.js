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
var con_1 = require("./con");
var CopyConnectionCommand = (function (_super) {
    __extends(CopyConnectionCommand, _super);
    function CopyConnectionCommand() {
        _super.apply(this, arguments);
        this.arguments = {
            name: {}
        };
    }
    CopyConnectionCommand = __decorate([
        src_1.command('cp', 'Copy connection', 'Create a new connection based on an existing one', con_1.ConnectionGroup), 
        __metadata('design:paramtypes', [])
    ], CopyConnectionCommand);
    return CopyConnectionCommand;
}(con_1.ConnectionCommand));
exports.CopyConnectionCommand = CopyConnectionCommand;
//# sourceMappingURL=con_cp.js.map