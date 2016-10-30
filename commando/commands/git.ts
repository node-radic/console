import { Group, group, command, Command } from "../../src";
import { COMMANDO,inject, injectable } from "../core";
import { ConnectionCommand } from "./con";
import { ICache , GitRestRemote , Connection } from "../services";


@group('git', 'Git Helpers', 'Gi')
export class GitGroup extends Group {
}
@injectable()
export abstract class GitCommand extends ConnectionCommand {

    protected askConnection() {
        this.connections.filter({})
    }
}

@command('init', 'Initialize Git project', 'Give the current working directory a bit of R.', GitGroup)
export class GitInitCommand extends GitCommand {
    arguments = {
        arg: { desc: '', type: 'string', required: false, default: 'defaultValue' }
    }
    options   = {
        o: { alias: 'opt', desc: '', string: true, default: 'deefaultVAlue' }
    }

    handle() {

    }
}

@command('ls', 'Git List', 'List something', GitGroup)
export class GitListCommand extends GitCommand {

    arguments = {
        // arg: {desc: '', type: 'string', required: false, default: 'defaultValue'}
    }
    options   = {
        // o: {alias: 'opt', desc: '', string: true, default: 'deefaultVAlue'}
    }

    handle() {

        this.connections.filter()
        this.out.line('This is the ls /  command')
    }
}


@group('repo', 'Git Repository Commands', 'Git repository commands', GitGroup)
export class GitRepoGroup extends Group {

}

@command('create', 'Create repository', 'List something', GitRepoGroup)
export class CreateGitRepoCommand extends GitCommand {

    arguments = {
        connection: { desc: 'Connection to use', type: 'string' },
        repository: { desc: 'The full repository name (owner/name) eg: "robinradic/blade-extensions"', type: 'string' }
    }
    options   = {
        m: { alias: 'mirrored', desc: 'Create a mirrored repository', boolean: true }
    }

    con: Connection

    // @inject(COMMANDO.CACHE)
    // cache: ICache

    handle() {
        let mirrored: boolean = this.opt('m');
        let filter: any       = { type: 'git' };
        if ( mirrored ) filter.remote = 'bitbucket_server'
        let gitConnections = this.connections.query.filter(filter).map('name').value<string[]>();
        if ( gitConnections.length === 1 ) {
            this.log.info('Automatically selected the only connection matching the requirements: ' + gitConnections[ 0 ])
        }
        this.in.askArgs(this.parsed, {
            connection: { choices: gitConnections, type: 'list', when: () => gitConnections.length > 1, default: gitConnections[ 0 ] },
            repository: { validate: (input: string) => input.split('/')[ 0 ].length > 1 && input.split('/')[ 1 ] !== undefined && input.split('/')[ 1 ].length > 1 }
        }).then((answers: any) => {
            this.con = this.connections.get(answers.connection);
            if ( mirrored ) {
                return this.createMirroredRepository()
            }
            let rem  = this.con.getRemote<GitRestRemote>()
            let repo = answers.repository.toString().split('/')
            this.createRepository(repo[ 0 ], repo[ 1 ])
        })

    }

    createMirroredRepository() {
        console.log('createMirroredRepository', arguments)
    }

    createRepository(owner: string, repo: string) {
        console.log('createRepository', arguments)
        let rem = this.con.getRemote<GitRestRemote>();
        rem.getRepositories(owner)
    }
}


