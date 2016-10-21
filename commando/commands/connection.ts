// export * from './connection'
import { Group, group, command, Command } from "../../src";
import { injectable, inject, COMMANDO } from "../core";
import { AuthMethod } from "../services";
import { ConnectionRepository, Connection } from "../services/connection";
import { RemoteFactory, IRemoteRegistration } from "../services/connection.remote";
import { inspect } from "util";
import * as ws from 'window-size';

// id: number
// name: string
// remote: string
// auth_method: string
// auth_key: string
// auth_secret: string
// extra: Object

@group('con', 'Connection Manager', 'Define connections to remote jenkins, jira, git, etc')
export class ConnectionGroup extends Group {
    @inject(COMMANDO.REMOTES)
    remotes: RemoteFactory

    handle() {
        this.showHelp('Connection Manager')
        this.out.header('Available Remotes')
        let table = this.out.columns()
        this.remotes.all().forEach((remote: IRemoteRegistration) => {
            table.push([
                `{skyblue}${remote.prettyName}{/skyblue}`,
                `{grey}${remote.name}{/grey}`
            ])
        })
        this.out.writeln(table.toString());

    }
}

@injectable()
export abstract class ConnectionCommand extends Command {

    @inject(COMMANDO.CONNECTIONS)
    connections: ConnectionRepository

    @inject(COMMANDO.REMOTES)
    remotes: RemoteFactory

    handle() {
        this.out.line(`This is the {green}con ${this.name}{/green} command`)
    }
}


@command('add', 'Add connection', 'Add a new connection', ConnectionGroup)
export class AddConnectionCommand extends ConnectionCommand {

    usage = '$0 [name] <remote?> <method?> <key?> <secret> <extra??>';

    example = `
$0 bb  bitbucket        basic   username    password
$0 bbs bitbucket_server oauth2  a3#A$j342   2i34@k24j https://ci.radic.nl
`;

    arguments = {
        name  : { desc: 'The name of the connection' },
        remote: { desc: 'Remote to connect to' },
        method: { desc: 'Auth method' },
        key   : { desc: '' },
        secret: { desc: '' },
        extra : { desc: '' },
    }

    validateName(name) {
        if(this.connections.has(name)){
            return 'A connection with that name already exists'
        }
    }

    handle() {
        // let done = this.async()
        super.handle();

        let con = this.connections.find('connections');
        let m = this.connections.find('hello')
        let model = this.connections.model({
            name: 'hello',
            remote: 'bitbucket',
            method: 'basic',
            key: 'radic',
            secret: '',
            extra: JSON.stringify({url:'https://projects.radic.nl'})
        });

        model.save();

        this.cli.exit()

        this.askArgs({
            name  : { type: 'input', message: 'name', validate: (input: string) => this.validateName(input) },
            remote: { type: 'list', message: 'remote', choices: (answers: any) => this.remotes.names() },
            method: { type: 'list', message: 'authentication method', choices: (answers: any) => [ 'basic', 'oauth2', 'oauth', 'token' ] },
            key   : { type: 'input', message: (answers: any) => AuthMethod.getKeyName(answers.method || this.parsed.arg('method')) },
            secret: { type: 'password', message: (answers: any) => AuthMethod.getSecretName(answers.method || this.parsed.arg('method')) },
            // extra : { type: 'input', message: 'Enter URL', when: (answers: any) => [ Remote.bitbucket_server.toString(), Remote.packagist.toString(), Remote.jira.toString(), Remote.jenkins.toString() ].indexOf(answers.remote || this.argv.remote) !== - 1 }
        }, this.argv).then((args: any) => {
            this.out.dump(args);
            let model = this.connections.model(args);
            model.save()
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

@command('list', 'List connections', 'List connections or remotes', ConnectionGroup)
export class ListConnectionCommand extends ConnectionCommand {
    handle(){
        super.handle()
        let head = ['Name', 'Remote', 'Auth Method', 'Extra']
        let table = this.out.columns({
            head
        })

        let cols = process.stdout['columns']

        function calc(head:string[], max:number=100){
            let percentWidth = max / 100
            let colPercent = 100 / head.length
            let colWidth = colPercent * percentWidth
            return head.map((col) => {
                return colWidth
            })
        }

        let colsWidth = calc(head, ws.width)

        // table.push(['Name', 'Remote', 'Auth Method', 'Extra'].map((col:string) => `{yellow.bold}${col}{/yellow./bold}`))
        this.connections.all().forEach((con:Connection) => {
            table.push([con.name, con.remote, con.method, inspect(con.extra, {colors: false, depth: 1, showHidden: false })])
        })
        this.out.writeln(table.toString())
        let a = 'a';
    }
}
@command('rm', 'Remove connection', 'Remove a connection', ConnectionGroup)
export class RemoveConnectionCommand extends ConnectionCommand {
}
@command('cp', 'Copy connection', 'Create a new connection based on an existing one', ConnectionGroup)
export class CopyConnectionCommand extends ConnectionCommand {
}
@command('edit', 'Edit connection', 'Edit a existing connection', ConnectionGroup)
export class EditConnectionCommand extends ConnectionCommand {
}

