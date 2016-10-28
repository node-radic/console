import { unlinkSync } from "fs";
import { copySync, readJsonSync } from "fs-extra";
import * as moment from 'moment';
import { existsSync } from "fs";
import { resolve } from "path";
import { Group, group, injectable, command, Command, InteractionCommandHelper,inject } from "../../src";
import { paths, COMMANDO } from "../core";
import { Database } from "../services";
import { IOptionsDefinition, IOption } from "../../src/definitions/definitions";
import globule = require("globule");

@group('db', 'Internal Database Manager', 'Manage Commando\'s internal database')
export class DBGroup extends Group {
}

@injectable()
export abstract class DBCommand extends Command {
    @inject(COMMANDO.DATABASE)
    protected db: Database;
}

@command('show', 'Show Database data', 'View tables, columns, rows etc', DBGroup)
export class ShowDBCommand extends DBCommand {
    options: ['t']

}


@command('reset', 'Reset Database', 'Clears all data. You will lose all the saved settings.', DBGroup)
export class ResetDBCommand extends DBCommand {

    handle() {
        this.in.confirm('Should i create a backup?', true).then((backup: boolean) => {
            if ( backup ) {
                let backupPath = this.db.backup();
                this.log.info('Database backup created at ' + backupPath + '. Use the {command}restore{/command} command to revert back the changes.')
            }
            this.db.drop()
            this.log.info('Database has been reset')
        })
    }
}

@command('restore', 'Restore Database', 'Restore a backup of the database.', DBGroup)
export class RestoreDBCommand extends DBCommand {
    arguments = {
        // path: { desc: 'Path to the DB backup file', type: 'string' }
    }
    options = {
        p: { alias: 'path', desc: 'Path to backup file location', string: true},
        l: { alias: 'list', desc: 'List internal backups', boolean: true }
    }

    handle() {
        if(!this.opt('p')){
        }
        if(this.opt('l')){
            this.list();
        }
    }

    list(){
        let backups = this.db.listBackups();
        if(backups.length === 0) return this.log.warn('No internal backups have been made.')
        this.out.header(`Internal backups (${backups.length})`)
        backups.forEach((backup) => {
            this.out.writeln(` - ${backup}`)
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
export class BackupDBCommand extends DBCommand {
    options =  {
    }

    handle(){
    }

}
