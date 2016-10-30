// export * from './connection'
import { command } from "../../src";
import { AuthMethod } from "../services";
import InteractionCommandHelper from "../../src/commands/helpers/interaction";
import { ConnectionGroup, ConnectionCommand } from "./con";


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

    validateName(name): string | boolean {
        if ( this.connections.has(name) ) {
            return 'A connection with that name already exists'
        }
        return true
    }

    handle() {
        let interact = this.getHelper<InteractionCommandHelper>('interaction');

        interact.askArgs({
            name  : { type: 'input', message: 'name', validate: (input: string) => this.validateName(input) },
            remote: { type: 'list', message: 'remote', choices: (answers: any) => this.remotes.keys() },
            method: { type: 'list', message: 'authentication method', choices: (answers: any) => [ 'basic', 'oauth2', 'oauth', 'token' ] },
            key   : { type: 'input', message: (answers: any) => AuthMethod.getKeyName(answers.method || this.parsed.arg('method')) },
            secret: { type: 'password', message: (answers: any) => AuthMethod.getSecretName(answers.method || this.parsed.arg('method')) },
            // extra : { type: 'input', message: 'Enter URL', when: (answers: any) => [ Remote.bitbucket_server.toString(), Remote.packagist.toString(), Remote.jira.toString(), Remote.jenkins.toString() ].indexOf(answers.remote || this.argv.remote) !== - 1 }
        }).then((args: any) => {
            this.out.dump(args);
            let model    = this.connections.model(args);
            let validate = model.validate();
            if ( validate.passes() )
                return model.save()

            this.log.error('Validation errors', validate.errors.all())
            Object.keys(validate.errors.all()).forEach((argName) => {
                this.log.error(validate.errors.first(argName))
            })

        })
    }
}
