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
const fs_extra_1 = require("fs-extra");
const fs_1 = require("fs");
const path_1 = require("path");
const src_1 = require("../../src");
const core_1 = require("../core");
const services_1 = require("../services");
const database_1 = require("../services/database");
const dev_1 = require("./dev");
let DBGroup = class DBGroup extends src_1.Group {
};
DBGroup = __decorate([
    src_1.group('db', 'Internal Database Manager', 'Manage Commando\'s internal database', dev_1.DevGroup), 
    __metadata('design:paramtypes', [])
], DBGroup);
exports.DBGroup = DBGroup;
let DBCommand = class DBCommand extends src_1.Command {
};
__decorate([
    src_1.inject(core_1.COMMANDO.DATABASE), 
    __metadata('design:type', services_1.Database)
], DBCommand.prototype, "db", void 0);
DBCommand = __decorate([
    src_1.injectable(), 
    __metadata('design:paramtypes', [])
], DBCommand);
exports.DBCommand = DBCommand;
let ShowDBCommand = class ShowDBCommand extends DBCommand {
    constructor(...args) {
        super(...args);
        this.options = {
            t: { alias: 'show-tables', desc: 'Show tables', boolean: true },
        };
    }
    handle() {
        if (this.opt('t')) {
        }
        this.showTables();
    }
    showTables() {
        let models = this.db.getModels();
        Object.keys(models).forEach((modelId) => {
            let model = database_1.getModel(modelId);
            let table = this.out.table(model._columns);
            model.query().value().forEach((row) => table.push(Object.keys(row).map((key) => row[key])));
            this.out.line(`{header}${model._table}{/header}`).line(table.toString());
        });
    }
};
ShowDBCommand = __decorate([
    src_1.command('show', 'Show Database data', 'View tables, columns, rows etc', DBGroup), 
    __metadata('design:paramtypes', [])
], ShowDBCommand);
exports.ShowDBCommand = ShowDBCommand;
let ResetDBCommand = class ResetDBCommand extends DBCommand {
    handle() {
        this.in.confirm('Should i create a backup?', true).then((backup) => {
            if (backup) {
                let backupPath = this.db.backup();
                this.log.info('Database backup created at ' + backupPath + '. Use the {command}restore{/command} command to revert back the changes.');
            }
            this.db.drop();
            this.log.info('Database has been reset');
        });
    }
};
ResetDBCommand = __decorate([
    src_1.command('reset', 'Reset Database', 'Clears all data. You will lose all the saved settings.', DBGroup), 
    __metadata('design:paramtypes', [])
], ResetDBCommand);
exports.ResetDBCommand = ResetDBCommand;
let RestoreDBCommand = class RestoreDBCommand extends DBCommand {
    constructor(...args) {
        super(...args);
        this.arguments = {};
        this.options = {
            p: { alias: 'path', desc: 'Path to backup file location', string: true },
            l: { alias: 'list', desc: 'List internal backups', boolean: true }
        };
    }
    handle() {
        if (!this.opt('p')) {
        }
        if (this.opt('l')) {
            this.list();
        }
    }
    list() {
        let backups = this.db.listBackups();
        if (backups.length === 0)
            return this.log.warn('No internal backups have been made.');
        this.out.header(`Internal backups (${backups.length})`);
        backups.forEach((backup) => {
            this.out.writeln(` - ${backup}`);
        });
    }
    restore(filePath) {
        filePath = path_1.resolve(filePath);
        if (!fs_1.existsSync(filePath)) {
            this.fail('File does not exist at ' + filePath);
        }
        let db = fs_extra_1.readJsonSync(filePath);
        this.out.dump(db);
    }
};
RestoreDBCommand = __decorate([
    src_1.command('restore', 'Restore Database', 'Restore a backup of the database.', DBGroup), 
    __metadata('design:paramtypes', [])
], RestoreDBCommand);
exports.RestoreDBCommand = RestoreDBCommand;
let BackupDBCommand = class BackupDBCommand extends DBCommand {
    constructor(...args) {
        super(...args);
        this.options = {};
    }
    handle() {
    }
};
BackupDBCommand = __decorate([
    src_1.command('backup', 'Backup Database', 'Create a backup of the database.', DBGroup), 
    __metadata('design:paramtypes', [])
], BackupDBCommand);
exports.BackupDBCommand = BackupDBCommand;
//# sourceMappingURL=dev_db.js.map