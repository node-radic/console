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
var RemoveConnectionCommand = (function (_super) {
    __extends(RemoveConnectionCommand, _super);
    function RemoveConnectionCommand() {
        _super.apply(this, arguments);
        this.arguments = {
            name: { desc: 'The name of the connection' }
        };
    }
    RemoveConnectionCommand.prototype.handle = function () {
        var m = this.connections.model({
            name: 'asdf',
            remote: 'fff'
        });
        var v = m.validate();
        var pass = v.passes();
        var errors = v.errors;
        if (pass) {
            m.save();
        }
    };
    RemoveConnectionCommand.prototype.handle2 = function () {
        var _this = this;
        this.askArgs({
            name: { type: 'list', message: 'Pick connections', choices: function (answers) { return _this.connections.query.map('names').value(); } }
        }).then(function (args) {
            _this.out.dump(args);
        });
    };
    RemoveConnectionCommand = __decorate([
        src_1.command('rm', 'Remove connection', 'Remove a connection', con_1.ConnectionGroup), 
        __metadata('design:paramtypes', [])
    ], RemoveConnectionCommand);
    return RemoveConnectionCommand;
}(con_1.ConnectionCommand));
exports.RemoveConnectionCommand = RemoveConnectionCommand;
//# sourceMappingURL=con_rm.js.map