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
var core_1 = require("../core");
var fs_1 = require("fs");
var fs_extra_1 = require("fs-extra");
var moment = require('moment');
var DBGroup = (function (_super) {
    __extends(DBGroup, _super);
    function DBGroup() {
        _super.apply(this, arguments);
    }
    DBGroup = __decorate([
        src_1.group('db', 'Internal Database Manager', 'Manage Commando\'s internal database'), 
        __metadata('design:paramtypes', [])
    ], DBGroup);
    return DBGroup;
}(src_1.Group));
exports.DBGroup = DBGroup;
var ShowDBCommand = (function (_super) {
    __extends(ShowDBCommand, _super);
    function ShowDBCommand() {
        _super.apply(this, arguments);
    }
    ShowDBCommand = __decorate([
        src_1.command('show', 'Show Database data', 'View tables, columns, rows etc', DBGroup), 
        __metadata('design:paramtypes', [])
    ], ShowDBCommand);
    return ShowDBCommand;
}(src_1.Command));
exports.ShowDBCommand = ShowDBCommand;
var ResetDBCommand = (function (_super) {
    __extends(ResetDBCommand, _super);
    function ResetDBCommand() {
        _super.apply(this, arguments);
    }
    ResetDBCommand.prototype.handle = function () {
        var _this = this;
        this.in.confirm('Should i create a backup?', true).then(function (backup) {
            if (backup) {
                var backupPath = core_1.paths.userDatabase + moment().format('Y.M.D-H.mm.ss.[backup]');
                fs_extra_1.copySync(core_1.paths.userDatabase, backupPath);
                _this.log.info('Database backup created at ' + core_1.paths.userDatabase + moment().format('.Y-M-D_H-mm-ss.[backup]'));
            }
            fs_1.unlinkSync(core_1.paths.userDatabase);
            _this.log.info('Database has been reset');
        });
    };
    ResetDBCommand = __decorate([
        src_1.command('reset', 'Reset Database', 'Clears all data. You will lose all the saved settings.', DBGroup), 
        __metadata('design:paramtypes', [])
    ], ResetDBCommand);
    return ResetDBCommand;
}(src_1.Command));
exports.ResetDBCommand = ResetDBCommand;
var RestoreDBCommand = (function (_super) {
    __extends(RestoreDBCommand, _super);
    function RestoreDBCommand() {
        _super.apply(this, arguments);
        this.arguments = {
            path: { desc: 'Path to the DB backup file', type: 'string' }
        };
    }
    RestoreDBCommand.prototype.handle = function () {
        var _this = this;
        var interact = this.getHelper('interaction');
        interact.askArgs({
            path: { message: this.arguments.path.desc }
        }).then(function (answers) {
            _this.out.dump(answers);
        });
    };
    RestoreDBCommand = __decorate([
        src_1.command('restore', 'Restore Database', 'Restore a backup of the database.', DBGroup), 
        __metadata('design:paramtypes', [])
    ], RestoreDBCommand);
    return RestoreDBCommand;
}(src_1.Command));
exports.RestoreDBCommand = RestoreDBCommand;
var BackupDBCommand = (function (_super) {
    __extends(BackupDBCommand, _super);
    function BackupDBCommand() {
        _super.apply(this, arguments);
    }
    BackupDBCommand = __decorate([
        src_1.command('backup', 'Backup Database', 'Create a backup of the database.', DBGroup), 
        __metadata('design:paramtypes', [])
    ], BackupDBCommand);
    return BackupDBCommand;
}(src_1.Command));
exports.BackupDBCommand = BackupDBCommand;
//# sourceMappingURL=db.js.map