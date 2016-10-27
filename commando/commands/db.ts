import { Group, group, command, Command } from "../../src";
import { paths } from "../core";
import { unlinkSync } from "fs";
import { copySync } from "fs-extra";
import * as moment from 'moment';
import { IArgumentDefinition } from "../../src/definitions/definitions";
import InteractionCommandHelper from "../../src/commands/helpers/interaction";

@group('db', 'Internal Database Manager', 'Manage Commando\'s internal database')
export class DBGroup extends Group {
}


@command('show', 'Show Database data', 'View tables, columns, rows etc', DBGroup)
export class ShowDBCommand extends Command {
}

@command('reset', 'Reset Database', 'Clears all data. You will lose all the saved settings.', DBGroup)
export class ResetDBCommand extends Command {
    handle() {
        this.in.confirm('Should i create a backup?', true).then((backup: boolean) => {
            if ( backup ) {
                let backupPath = paths.userDatabase + moment().format('Y.M.D-H.mm.ss.[backup]')
                copySync(paths.userDatabase, backupPath)
                this.log.info('Database backup created at ' + paths.userDatabase + moment().format('.Y-M-D_H-mm-ss.[backup]'))
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
}


@command('backup', 'Backup Database', 'Create a backup of the database.', DBGroup)
export class BackupDBCommand extends Command {
}
