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
var util_1 = require("util");
var ListConnectionCommand = (function (_super) {
    __extends(ListConnectionCommand, _super);
    function ListConnectionCommand() {
        _super.apply(this, arguments);
    }
    ListConnectionCommand.prototype.handle = function () {
        _super.prototype.handle.call(this);
        var table = this.out.columns(['Name', 'Remote', 'Auth Method', 'Extra']);
        this.connections.all().forEach(function (con) {
            table.push([con.name, con.remote, con.method, util_1.inspect(con.extra, { colors: false, depth: 1, showHidden: false })]);
        });
        this.out.writeln(table.toString());
    };
    ListConnectionCommand = __decorate([
        src_1.command('ls', 'List connections', 'List connections or remotes', con_1.ConnectionGroup), 
        __metadata('design:paramtypes', [])
    ], ListConnectionCommand);
    return ListConnectionCommand;
}(con_1.ConnectionCommand));
exports.ListConnectionCommand = ListConnectionCommand;
//# sourceMappingURL=con_ls.js.map