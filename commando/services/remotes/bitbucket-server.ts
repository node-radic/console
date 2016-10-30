import * as _ from 'lodash'

import { remote, RemoteExtra, RestRemote, AuthMethod, GitRestRemote } from "../remote";

export class BitbucketServerExtra extends RemoteExtra {

    getName(): string {return 'url' }

    getPrettyName(): string {return 'Bitbucket Server Base URL'}
}

@remote('bitbucket_server', 'Bitbucket Server', 'git')
export class BitbucketServerRemote extends GitRestRemote {
    getAuthMethods() { return [ AuthMethod.basic, AuthMethod.oauth2, AuthMethod.oauth ] }

    usesExtra       = true
    extraDefinition = new BitbucketServerExtra()

    protected init() {
        let url: string = this.connection.extra.url
        // if ( ! url.endsWith('rest/api/1.0') || ! url.endsWith('rest/api/1.0/') ) {
            if ( ! url.endsWith('/') )
                url += '/'
            url += 'rest/api/1.0'
        // }
        this.mergeDefaults({
            baseUrl: url,
            auth   : { username: this.connection.key, password: this.connection.secret }
        })
    }

    getUserRepositories(username?: string): Promise<any> {
        return undefined;
    }

    getUserTeams(username?: string, opts:any = {}): Promise<string[]> {
        return this.get('projects', _.merge({ pagelen: 100 }, opts)).then((res:any) => {
            return new Promise((resolve, reject) => {
                resolve(Object.keys(_.keyBy(res.values, 'key')))
            })
        })
    }

    deleteRepository(owner: string, repo: string): Promise<any> {
        return this.delete(`projects/${owner}/repos/${repo}`);
    }

    createRepository(owner: string, repo: string, opts?: any): Promise<Promise<any>> {
        return this.post(`projects/${owner}/repos`, _.merge({name: repo}, opts))
    }

    getRepositories(owner?: string): Promise<any> {
        return undefined;
    }

    getRepository(owner: string, repo: string): Promise<any> {
        return undefined;
    }

    getUser(username?: string): Promise<any> {
        return undefined;
    }

    getTeam(team: string): Promise<any> {
        return undefined;
    }

    getTeamRepositories(team: string): Promise<any> {
        return undefined;
    }


}
