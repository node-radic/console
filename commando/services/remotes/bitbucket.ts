import * as _ from 'lodash'
import { remote, RemoteExtra, RestRemote, AuthMethod, GitRestRemote } from "../remote";


@remote('bitbucket', 'Bitbucket', "git")
export class BitbucketRemote extends GitRestRemote {
    getAuthMethods(){ return  [AuthMethod.basic, AuthMethod.oauth2, AuthMethod.oauth] }
    usesExtra = false

    protected init() {
        this.mergeDefaults({
            baseUrl: 'https://api.bitbucket.org/2.0',
            auth   : {username: this.connection.key, password: this.connection.secret}
        })
    }
    getUserRepositories(username?: string): Promise<any> {
        return undefined;
    }

    getUserTeams(username?: string, opts:any = {}): Promise<string[]> {
        return this.get('teams', _.merge({ role: 'member', pagelen: 100 }, opts)).then((res:any) => {
            return new Promise((resolve, reject) => {
                resolve(Object.keys(_.keyBy(res.values, 'username')))
            })
        })
    }

    deleteRepository(owner: string, repo: string): Promise<any> {
        return this.delete(`repositories/${owner}/${repo}`)
    }

    createRepository(owner: string, repo: string, opts: any = {}): Promise<Promise<any>> {
        return this.post(`repositories/${owner}/${repo}`, _.merge({}, opts))
    }

    getRepositories(owner?: string): Promise<any> {
        return undefined;
    }

    getRepository(owner: string, repo: string): Promise<any> {
        return undefined;
    }

    getUser(username?: string): Promise<any> {
        return this.get('user');
    }

    getTeam(team: string): Promise<any> {
        return undefined;
    }

    getTeamRepositories(team: string): Promise<any> {
        return undefined;
    }


}
