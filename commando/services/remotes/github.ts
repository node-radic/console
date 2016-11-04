import * as _ from 'lodash';
import { remote, RemoteExtra, GitRestRemote, AuthMethod } from "../remote";
@remote('github', 'Github', 'git')
export class GithubRemote extends GitRestRemote {

    getMirrorUrl(owner:string, repo:string): string {
        return `https://github.com/${owner}/${repo}`;
    }
    usesExtra = false

    getAuthMethods() { return [ AuthMethod.basic, AuthMethod.oauth2, AuthMethod.oauth ] }

    protected init() {
        this.mergeDefaults({
            baseUrl: 'https://api.github.com/',
            auth   : { username: this.connection.key, password: this.connection.secret },
            headers: {
                'User-Agent': 'Commando',
                //'Accept': 'application/vnd.github.v3+json'
            }
        })
    }

    getRepositories(owner: string): Promise<any> {
        return <any> this.getUser().then((res: any) => {
            // console.dir(res)
            // opts = _.merge({ name: repo }, opts)
            let repos = owner.toLowerCase() === res.login.toLowerCase() ? this.get('user/repos') : this.post(`orgs/${owner}/repos`);
            repos.then((repos:any) => {
                console.dir(repos)
            })
        })
    }


    getRepository(owner: string, repo: string): Promise<any> {
        return this.get(`repos/${owner}/${repo}`);
    }

    createRepository(owner: string, repo: string, opts: any = {}): Promise<any> {
        // console.log('owner', owner, 'repo', repo, 'opts', opts)
        return <any> this.getUser().then((res: any) => {
            // console.dir(res)
            opts = _.merge({ name: repo }, opts)
            return owner.toLowerCase() === res.login.toLowerCase() ? this.post('user/repos', opts) : this.post(`orgs/${owner}/repos`, opts);
        })
    }

    deleteRepository(owner: string, repo: string): Promise<any> {
        return this.delete(`repos/${owner}/${repo}`);
    }

    getUser(username?: string): Promise<any> {
        return username ? this.get(`users/${username}`) : this.get('user')
    }

    getUserTeams(username?: string): Promise<string[]> {
        let teams = username ? this.get(`users/${username}/orgs`) : this.get('user/orgs')
        return teams.then((res) => {
            return new Promise((resolve, reject) => {
                resolve(Object.keys(_.keyBy(res, 'login')))
            })
        })
    }

    getUserRepositories(username?: string): Promise<any> {
        return username ? this.get(`users/${username}/repos`) : this.get('user/repos')
    }

    getTeam(team: string): Promise<any> {
        return this.get(`orgs/${team}`)
    }

    getTeamRepositories(team: string): Promise<any> {
        return this.get(`orgs/${team}/repos`)
    }
}

