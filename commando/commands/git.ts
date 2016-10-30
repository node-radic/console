import { Group, group, command, Command } from "../../src";
import { COMMANDO, inject, injectable } from "../core";
import { ConnectionCommand } from "./con";
import { ICache, GitRestRemote, Connection } from "../services";
import { GithubRemote } from "../services/remotes/github";
import { BitbucketServerRemote } from "../services/remotes/bitbucket-server";
import * as inquirer from 'inquirer';


@group('git', 'Git Helpers', 'Gi')
export class GitGroup extends Group {
}
@injectable()
export abstract class GitCommand extends ConnectionCommand {

    protected askConnection(filter: any = {}): Promise<string> {
        filter.type        = 'git';
        let gitConnections = this.connections.query.filter(filter).map('name').value<string[]>();
        if ( gitConnections.length === 1 ) {
            this.log.info('Automatically selected the only connection matching the requirements: ' + gitConnections[ 0 ])
        }
        return <any> this.askArg('connection', { type: 'list', choices: gitConnections })
    }

    protected getProjects(connection: Connection) {
        connection.getRemote<GitRestRemote>().getUserTeams()
    }

    protected async createGitCache() {
        return new Promise((resolve, reject) => {
            this.connections.filter({ type: 'git', remote: 'github' }).forEach((con: Connection) => {
                this.out.subtitle('Using connection: ' + con.name)
                let rem = con.getRemote<GithubRemote>();
                rem.getUser().catch(console.error.bind(console)).then((data: any) => {
                    this.out.header('getUser').dump(data)
                    return rem.getUserRepositories().catch(console.error.bind(console))
                }).then((data: any)=> {
                    this.out.header('getUserRepositories').dump(data)
                    return rem.getUserTeams().catch(console.error.bind(console))
                }).then((data: any)=> {
                    this.out.header('getUserTeams').dump(data)
                })
            })
        })
    }


}

@command('init', 'Initialize Git project', 'Give the current working directory a bit of R.', GitGroup)
export class GitInitCommand extends GitCommand {
    handle() {
        this.createGitCache().then((data: any) => {
            this.out.title('createGitCache');
            this.out.dump(data)
        })
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
@command('delete', 'Delete repository', 'Delete remote repository', GitRepoGroup)
export class DeleteGitRepoCommand extends GitCommand {

    arguments = {
        connection: { desc: 'Connection to use', type: 'string' },
        project   : { desc: 'The project (aka "team" or "owner" or "organisation")', type: 'string' },
        repository: { desc: 'The repository name', type: 'string' }
    }

    handle() {
        let con: Connection, rem: GitRestRemote, ans:any

        this.askConnection().then((connection) => {
            con = this.connections.get(connection);
            rem = con.getRemote<GitRestRemote>()
            // rem.getUserTeams().then((res:any) => {
            //     this.out.dump(res)
            // })

            return rem.getUserTeams()
        }).then((teams: any) => {
            // this.out.dump(teams)
            // this.con.getRemote<GitRestRemote>().getUserTeams()
            return this.in.askArgs(this.parsed, {
                // connection: { choices: gitConnections, type: 'list', when: () => gitConnections.length > 1, default: gitConnections[ 0 ] },
                project   : { type: 'list', choices: teams },
                repository: {}
            })
        }).then((answers: any) => {
            ans = answers
            return rem.deleteRepository(ans.project, ans.repository);
        }).then((res) => {
            this.out.success(`Deleted repository "${ans.project}/${ans.repository}" on connection "${con.name}"`)
        }, this.fail.bind(this))

    }

}

@command('create', 'Create repository', 'List something', GitRepoGroup)
export class CreateGitRepoCommand extends GitCommand {

    arguments = {
        connection: { desc: 'Connection to use', type: 'string' },
        project   : { desc: 'The project/team/owner', type: 'string' },
        repository: { desc: 'The repository name', type: 'string' }
    }
    options   = {
        m: { alias: 'mirrored', desc: 'Create a mirrored repository', boolean: true },
        a: { alias: 'add-mirror', desc: 'Add a mirrored repository', array: true },
        o: { alias: 'option', desc: 'Set option for remote (eg "description")', default: {private: false, has_wiki: false, description: ''}}
    }

    usage: 'create <connection> <project> <repository> bbs radic addon-new -a gh:robinradic/addon-new -a bb'
    con: Connection
    rem: GitRestRemote

    @inject(COMMANDO.CACHE)
    cache: ICache

    handle() {


        let mirrored: boolean = this.opt('m');
        let filter: any       = {};
        if ( mirrored ) filter.remote = 'bitbucket_server'

        this.askConnection().then((connection) => {
            this.con = this.connections.get(connection);
            this.rem = this.con.getRemote<GitRestRemote>()
            this.rem.getUserTeams().then((res:any) => this.out.dump(res))
            return this.rem.getUserTeams()
        }).then((teams) => {
            return this.in.askArgs(this.parsed, {
                project   : { type: 'list', choices: teams },
                repository: {}
            }).then((answers: any) => {
                if ( mirrored ) {
                    return this.createMirroredRepository()
                }
                this.createRepository(answers.project, answers.repository)
            }, this.fail.bind(this))
        }, this.fail.bind(this))

    }

    createMirroredRepository() {
        let rem = this.con.getRemote<BitbucketServerRemote>()

        console.log('createMirroredRepository', arguments)
    }

    createRepository(owner: string, repo: string) {
        // console.log('createRepository', arguments)
        let rem = this.con.getRemote<GitRestRemote>();
        //let repos = rem.getRepositories(owner)
        rem.createRepository(owner, repo, this.opt('o')).then((res: any) => {
            this.out.success(`Repository "${owner}/${repo}" created on connection "${this.con.name}"`)
        }, this.fail.bind(this))
    }
}


