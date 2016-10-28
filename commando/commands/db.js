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
var fs_extra_1 = require("fs-extra");
var fs_1 = require("fs");
var path_1 = require("path");
var src_1 = require("../../src");
var core_1 = require("../core");
var services_1 = require("../services");
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
var DBCommand = (function (_super) {
    __extends(DBCommand, _super);
    function DBCommand() {
        _super.apply(this, arguments);
    }
    __decorate([
        src_1.inject(core_1.COMMANDO.DATABASE), 
        __metadata('design:type', services_1.Database)
    ], DBCommand.prototype, "db", void 0);
    DBCommand = __decorate([
        src_1.injectable(), 
        __metadata('design:paramtypes', [])
    ], DBCommand);
    return DBCommand;
}(src_1.Command));
exports.DBCommand = DBCommand;
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
}(DBCommand));
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
                var backupPath = _this.db.backup();
                _this.log.info('Database backup created at ' + backupPath + '. Use the {command}restore{/command} command to revert back the changes.');
            }
            _this.db.drop();
            _this.log.info('Database has been reset');
        });
    };
    ResetDBCommand = __decorate([
        src_1.command('reset', 'Reset Database', 'Clears all data. You will lose all the saved settings.', DBGroup), 
        __metadata('design:paramtypes', [])
    ], ResetDBCommand);
    return ResetDBCommand;
}(DBCommand));
exports.ResetDBCommand = ResetDBCommand;
var RestoreDBCommand = (function (_super) {
    __extends(RestoreDBCommand, _super);
    function RestoreDBCommand() {
        _super.apply(this, arguments);
        this.arguments = {};
        this.options = {
            p: { alias: 'path', desc: 'Path to backup file location', string: true },
            l: { alias: 'list', desc: 'List internal backups', boolean: true }
        };
    }
    RestoreDBCommand.prototype.handle = function () {
        if (!this.opt('p')) {
        }
        if (this.opt('l')) {
            this.list();
        }
    };
    RestoreDBCommand.prototype.list = function () {
        var _this = this;
        var backups = this.db.listBackups();
        if (backups.length === 0)
            return this.log.warn('No internal backups have been made.');
        this.out.header("Internal backups (" + backups.length + ")");
        backups.forEach(function (backup) {
            _this.out.writeln(" - " + backup);
        });
    };
    RestoreDBCommand.prototype.restore = function (filePath) {
        filePath = path_1.resolve(filePath);
        if (!fs_1.existsSync(filePath)) {
            this.fail('File does not exist at ' + filePath);
        }
        var db = fs_extra_1.readJsonSync(filePath);
        this.out.dump(db);
    };
    RestoreDBCommand = __decorate([
        src_1.command('restore', 'Restore Database', 'Restore a backup of the database.', DBGroup), 
        __metadata('design:paramtypes', [])
    ], RestoreDBCommand);
    return RestoreDBCommand;
}(DBCommand));
exports.RestoreDBCommand = RestoreDBCommand;
var BackupDBCommand = (function (_super) {
    __extends(BackupDBCommand, _super);
    function BackupDBCommand() {
        _super.apply(this, arguments);
        this.options = {};
    }
    BackupDBCommand.prototype.handle = function () {
    };
    BackupDBCommand = __decorate([
        src_1.command('backup', 'Backup Database', 'Create a backup of the database.', DBGroup), 
        __metadata('design:paramtypes', [])
    ], BackupDBCommand);
    return BackupDBCommand;
}(DBCommand));
exports.BackupDBCommand = BackupDBCommand;
//# sourceMappingURL=db.js.map