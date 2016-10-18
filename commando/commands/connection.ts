// export * from './connection'
import { Group, group, command, Command } from "../../src";
import { injectable, inject, COMMANDO } from "../core";
import { IConnectionRepository } from "../services";
import { AuthMethod } from "../services/connections";
import { Remote } from "../services/remotes/remote";


// id: number
// name: string
// remote: string
// auth_method: string
// auth_key: string
// auth_secret: string
// extra: Object

@group('con', 'Connection manager. Connect to jenkins, jira, git, etc')
export class ConnectionGroup extends Group {
    handle() {
        this.showHelp()
    }
}

@injectable()
export abstract class ConnectionCommand extends Command {

    @inject(COMMANDO.CONNECTIONS)
    connections: IConnectionRepository

    handle() {
        this.out.line(`This is the {green}con ${this.name}{/green} command`)
    }
}


@command('add', 'Add a new connection', ConnectionGroup)
export class AddConnectionCommand extends ConnectionCommand {
    arguments = {
        name  : { description: 'The name of the connection', required: true },
        remote: { description: 'Remote to connect to' },
        method: { description: 'Auth method' },
        key   : { description: '' },
        secret: { description: '' },
        extra : { description: '' },
    }


    handle() {
        // let done = this.async()
        super.handle();

        this.askArgs({
            name  : { type: 'input', message: 'name' },
            remote: { type: 'list', message: 'remote', choices: [ 'first', 'second' ] },
            method: { type: 'list', message: 'authentication method', choices: (answers: any) => [ 'basic', 'oauth2', 'oauth', 'token' ] },
            key   : { type: 'input', message: (answers: any) => AuthMethod.getKeyName(answers.method || this.argv.method) },
            secret: { type: 'password', message: (answers: any) => AuthMethod.getSecretName(answers.method || this.argv.method) },
            extra : { type: 'input', message: 'Enter URL', when: (answers: any) => [ Remote.bitbucket_server.toString(), Remote.packagist.toString(), Remote.jira.toString(), Remote.jenkins.toString() ].indexOf(answers.remote || this.argv.remote) !== - 1 }


        }, this.argv).then((args: any) => {
            this.out.dump(args);
            // this.done();
        })


        // this.askArgs({
        //     remote: ['first', 'second'],
        //     method: ['basic', 'oauth2', 'oauth', 'token'],
        //     key: 'input',
        //     secret: 'password',
        //     extra: 'input'
        // }, (args:any) => {
        //     this.out.dump(args);
        //     // this.done();
        // })
    }
}

@command('list', 'List all connections', ConnectionGroup)
export class ListConnectionCommand extends ConnectionCommand {
}
@command('rm', 'Remove a connection', ConnectionGroup)
export class RemoveConnectionCommand extends ConnectionCommand {
}
@command('cp', 'Create a new connection based on an existing one', ConnectionGroup)
export class CopyConnectionCommand extends ConnectionCommand {
}
@command('edit', 'Edit a existing connection', ConnectionGroup)
export class EditConnectionCommand extends ConnectionCommand {
}

