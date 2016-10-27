import { Group, group, command, Command } from "../../src";
import * as path from 'path';
import { paths } from "../core";
import { unlinkSync } from "fs";
import { copySync, readJsonSync } from "fs-extra";
import * as moment from 'moment';
import { IArgumentDefinition } from "../../src/definitions/definitions";
import InteractionCommandHelper from "../../src/commands/helpers/interaction";
import { existsSync } from "fs";
import { resolve } from "path";

@group('db', 'Internal Database Manager', 'Manage Commando\'s internal database')
export class DBGroup extends Group {
}


@command('show', 'Show Database data', 'View tables, columns, rows etc', DBGroup)
export class ShowDBCommand extends Command {
}


function backupDb(backupPath?:string){
    backupPath = backupPath || resolve('r-db-back' + moment().format('.Y-M-D_H-mm-ss.[backup]'));
    copySync(paths.userDatabase, backupPath);
}

@command('reset', 'Reset Database', 'Clears all data. You will lose all the saved settings.', DBGroup)
export class ResetDBCommand extends Command {
    handle() {
        this.in.confirm('Should i create a backup?', true).then((backup: boolean) => {
            if ( backup ) {
                let backupPath = paths.userDatabase + moment().format('.Y-M-D_H-mm-ss.[backup]')
                backupDb(backupPath);
                this.log.info('Database backup created at ' + backupPath + '. Use the {command}restore{/command} command to revert back the changes.')
            }
            unlinkSync(paths.userDatabase);
            this.log.info('Database has been reset')
        })
    }
}

@command('restore', 'Restore Database', 'Restore a backup of the database.', DBGroup)
export class RestoreDBCommand extends Command {
    arguments = {
        path: { desc: 'Path to the DB backup file', type: 'string' }
    }

    handle() {
        let interact = this.getHelper<InteractionCommandHelper>('interaction');
        interact.askArgs({
            path: { message: this.arguments.path.desc }
        }).then((answers) => {
            this.out.dump(answers)
        })
    }

    restore(filePath: string) {
        filePath = resolve(filePath)
        if ( ! existsSync(filePath) ) {
            this.fail('File does not exist at ' + filePath)
        }

        let db = readJsonSync(filePath)
        this.out.dump(db)
    }
}


@command('backup', 'Backup Database', 'Create a backup of the database.', DBGroup)
export class BackupDBCommand extends Command {
}
