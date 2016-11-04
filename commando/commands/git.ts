import { Group, group, command, Command } from "../../src";
import { COMMANDO, inject, injectable } from "../core";
import { ConnectionCommand } from "./con";
import { ICache, GitRestRemote, Connection } from "../services";
import { GithubRemote } from "../services/remotes/github";
import { BitbucketServerRemote } from "../services/remotes/bitbucket-server";
import * as inquirer from 'inquirer';
import * as async from 'async';
import { AuthMethod } from "../services/remote";
import * as _ from 'lodash';


@group('git', 'Git Helpers', 'Gi')
export class GitGroup extends Group {
}
@injectable()
export abstract class GitCommand extends ConnectionCommand {

    protected askConnection(filter: any = {}): Promise<string> {
        filter.type        = 'git';
        let gitConnections = this.connections.query.filter(filter).map('name').value<string[]>();
        if ( gitConnections.length === 1 ) {
            return new Promise((resolve, reject) => {
                this.log.info('Automatically selected the only connection matching the requirements: ' + gitConnections[ 0 ])
                resolve(gitConnections[ 0 ])
            })

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
        let con: Connection, rem: GitRestRemote, ans: any

        this.askConnection().then((connection) => {
            con = this.connections.get(connection);
            rem = con.getRemote<GitRestRemote>()
            return rem.getUserTeams()
        }).then((teams: any) => {
            return this.in.askArgs(this.parsed, {
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

interface Mirror { con: Connection, rem: GitRestRemote, name: string, project: string, repo: string, raw: string }

@command('mirror', 'Mirror repositories', 'Hook a repositories', GitRepoGroup)
export class MirrorGitRepoCommand extends GitCommand {

    arguments = {
        connection: { desc: 'Connection to use', type: 'string' },
        project   : { desc: 'The project/team/owner', type: 'string' },
        repository: { desc: 'The repository name', type: 'string' }
    }
    options   = {
        a: { alias: 'add-mirror', desc: 'Add a mirrored repository', array: true },
        u: { alias: 'unhook-all', desc: 'Unhook all mirrors', boolean: true },
        l: { alias: 'list', desc: 'List all mirrors', boolean: true }
    }

    hookKey = 'com.englishtown.stash-hook-mirror:mirror-repository-hook'
    project: string
    repository: string
    con: Connection
    rem: GitRestRemote

    @inject(COMMANDO.CACHE)
    cache: ICache

    handle() {
        this.handleArguments({ remote: 'bitbucket_server' }).then(() => {
            if ( this.opt('u') ) return this.handleUnhookAll(this.project, this.repository);
            if ( this.opt('l') ) return this.handleList()

            this.handleMirrorRepositories(this.project, this.repository, this.opt('a') || [])
        }, this.fail.bind(this))
    }

    protected handleList() {
        this.getMirrorsList(this.project, this.repository).then((list: string[]) => {
            this.out.header(`Mirror list (${list.length} mirrors)`)
            list.forEach((mirror: string) => {
                this.out.line(' - ' + mirror)
            })
        })
    }

    protected getMirrorsList(project: string, repo: string): Promise<string[]> {
        return this.rem.get(`projects/${project}/repos/${repo}/settings/hooks/${this.hookKey}/settings`, {}).then((res: any) => {
            let list = []
            Object.keys(res).forEach((key: string) => {
                if ( ! key.startsWith('mirrorRepoUrl') ) return
                list.push(res[ key ])
            })
            return new Promise((resolve, reject) => {
                resolve(list)
            })
        });

    }

    protected handleUnhookAll(project: string, repo: string) {
        this.rem.put(`projects/${project}/repos/${repo}/settings/hooks/${this.hookKey}/settings`, {}).then((res: any) => {
            this.log.info('All mirrors unhooked')
            this.log.silly('Response', res)
        });
    }

    protected handleArguments(filter: any = {}) {
        return this.askConnection().then((connection) => {
            this.con = this.connections.get(connection);
            this.rem = this.con.getRemote<GitRestRemote>()
            return this.rem.getUserTeams()
        }).then((teams) => {
            return this.askArgs({
                project   : { type: 'list', choices: teams },
                repository: {}
            }).then((answers: any) => {
                this.project    = answers.project
                this.repository = answers.repository
            })
        }, this.fail.bind(this))

    }

    protected handleMirrorRepositories(project: string, repo: string, mirrors: string[]): Promise<any> {
        return this.createMirrors(project, repo, mirrors);

    }

    protected createMirrors(project: string, repo: string, mirrors: string[]): Promise<any> {
        let rem              = this.con.getRemote<BitbucketServerRemote>()
        let jobs: Function[] = [
            (done) => rem.put(`projects/${project}/repos/${repo}/settings/hooks/${this.hookKey}/enabled`).then(() => done(), this.fail.bind(this))
        ];
        this.parseMirrors(project, repo, mirrors).forEach((mirror: Mirror) => {
            // let mirror = this.parseMirror(raw, project, repo)
            this.log.verbose('adding mirror', _.omit(mirror, 'con', 'rem'))
            jobs.push((done) => {
                if ( mirror.con.getMethod() !== AuthMethod.basic ) {
                    this.fail(`Cannot mirror "${mirror.name}". Mirroring only supports basic auth method for mirrors`)
                }

                this.createMirror(project, repo, mirror).then((res: any) => {
                    this.log.verbose('put hook settings res', res)
                    this.log.info(`Hook created on "${mirror.con.name}" > "${mirror.project}/${mirror.repo}"`)
                    done()
                });
            })
        })

        return new Promise((resolve, reject) => {
            async.waterfall(jobs, (err: Error, res: any) => {
                if ( err ) return reject(err)
                resolve()
            })
        })
    }

    protected parseMirrors(project: string, repo: string, mirrors:string[]) : Mirror[] {
        return mirrors.map((raw:string) => {
            return this.parseMirror(raw, project, repo)
        })
    }

    protected createMirror(project: string, repo: string, mirror: Mirror): Promise<any> {
        let rem = this.con.getRemote<BitbucketServerRemote>()
        return rem.get(`projects/${project}/repos/${repo}/settings/hooks/${this.hookKey}/settings`).then((res: any) => {
            this.log.verbose('get hook settings', res)
            return new Promise((resolve, reject) => {
                let len    = Object.keys(res).length
                let suffix = len === 0 ? 0 : (len / 3)
                this.log.verbose('put hook suffix for: ' + mirror.rem.name, { len, suffix })
                let data                         = {} // mirrorRepoUrl0, password0
                data[ 'username' + suffix ]      = mirror.con.key
                data[ 'password' + suffix ]      = mirror.con.secret
                data[ 'mirrorRepoUrl' + suffix ] = mirror.rem.getMirrorUrl(mirror.project, mirror.repo)
                resolve(_.merge(res, data))
            })
        }).then((data: any) => {
            this.log.verbose('put hook settings data', data)
            return rem.put(`projects/${project}/repos/${repo}/settings/hooks/${this.hookKey}/settings`, data)
        })
    }

    protected parseMirror(mirror: string, project: string, repo: string): Mirror {

        let withRepo = mirror.indexOf(':') !== - 1;
        let name     = withRepo ? mirror.split(':')[ 0 ] : mirror;
        let mProject = project;
        let mRepo    = repo;
        if ( withRepo ) {
            let to   = mirror.split(':')[ 1 ];
            mProject = to.split('/')[ 0 ];
            if ( to.split('/').length > 1 ) {
                mRepo = to.split('/')[ 1 ];
            }
        }

        if ( ! this.connections.has(name) ) {
            this.fail(`Could not find mirror "${name}"`)
        }
        let con = this.connections.get(name);
        return { name: name, con: con, rem: con.getRemote<GitRestRemote>(), project: mProject, repo: mRepo, raw: mirror }
    }
}


@command('create', 'Create repository', 'List something', GitRepoGroup)
export class CreateGitRepoCommand extends MirrorGitRepoCommand {

    options: any = {
        m: { alias: 'mirrored', desc: 'Create a mirrored repository', boolean: true },
        a: { alias: 'add-mirror', desc: 'Add a mirrored repository', array: true },
        o: { alias: 'option', desc: 'Set option for remote (eg "description")', default: { private: false, has_wiki: false, description: '' } }
    }

    usage: 'create <connection> <project> <repository> bbs radic addon-new -a gh:robinradic/addon-new -a bb'

    handle() {

        let mirrored: boolean = this.opt('m');
        this.handleArguments(mirrored ? { remote: 'bitbucket_server' } : {}).then(() => {
            if ( mirrored ) {
                return this.handleCreateMirrored(this.project, this.repository)
            }
            return this.handleCreate(this.project, this.repository)
        })
        //
        // this.askConnection(filter).then((connection) => {
        //     this.con = this.connections.get(connection);
        //     this.rem = this.con.getRemote<GitRestRemote>()
        //     return this.rem.getUserTeams()
        // }).then((teams) => {
        //     return this.in.askArgs(this.parsed, {
        //         project   : { type: 'list', choices: teams },
        //         repository: {}
        //     }).then((answers: any) => {
        //         if ( mirrored ) {
        //             return this.createMirroredRepository(answers.project, answers.repository)
        //         }
        //         this.createRepository(answers.project, answers.repository)
        //     }, this.fail.bind(this))
        // }, this.fail.bind(this))

    }

    handleCreateMirrored(project: string, repo: string) {
        let rem     = this.con.getRemote<BitbucketServerRemote>()
        let mirrors = this.opt('a')

        return this.createRepository(project, repo, rem).then(() => {
            return this.createMirrors(project, repo, mirrors)
        }).then(() => {
            let jobs:any = []
            this.parseMirrors(project, repo, mirrors).forEach((mirror:Mirror) => {
                jobs.push((done) => this.createRepository(mirror.project, mirror.repo, mirror.rem).then(() => {
                    this.log.info(`Repository created on "${mirror.con.name}" > "${mirror.project}/${mirror.repo}"`)
                    done()
                }))
            })
            async.waterfall(jobs, (err) => {
                if(err) this.fail(err.message)
                this.log.info('Mirrored repositories created')
            })
        })

        // console.log('createMirroredRepository', arguments)
    }

    handleCreate(owner: string, repo: string, rem?: GitRestRemote): Promise<any> {
        return this.createRepository(owner, repo, rem);
    }

    protected createRepository(owner: string, repo: string, rem?: GitRestRemote): Promise<any> {
        // console.log('createRepository', arguments)
        rem = rem || this.con.getRemote<GitRestRemote>();
        //let repos = rem.getRepositories(owner)
        return rem.createRepository(owner, repo, this.opt('o')).then((res: any) => {
            this.log.info(`Repository "${owner}/${repo}" created on connection "${this.con.name}"`)
        }, this.fail.bind(this))
    }


    //
    // protected parseMirror(mirror: string, project: string, repo: string): Mirror {
    //
    //     let withRepo = mirror.indexOf(':') !== - 1;
    //     let name     = withRepo ? mirror.split(':')[ 0 ] : mirror;
    //     let mProject = project;
    //     let mRepo    = repo;
    //     if ( withRepo ) {
    //         let to   = mirror.split(':')[ 1 ];
    //         mProject = to.split('/')[ 0 ];
    //         if ( to.split('/').length > 1 ) {
    //             mRepo = to.split('/')[ 1 ];
    //         }
    //     }
    //
    //     if ( ! this.connections.has(name) ) {
    //         this.fail(`Could not find mirror "${name}"`)
    //     }
    //     let con = this.connections.get(name);

}
