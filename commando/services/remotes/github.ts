import * as _ from 'lodash';

import { remote, RemoteExtra, GitRestRemote, AuthMethod } from "../remote";
import * as BB from "bluebird";

import * as rp from "request-promise";

@remote('github', 'Github', 'git')
export class GithubRemote extends GitRestRemote {
    createRepository(owner: string, repo: string): rp.RequestPromise {
        return undefined
    }

    getRepositories(owner: string): rp.RequestPromise {
        return undefined
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

    deleteRepository(owner: string, repo: string): rp.RequestPromise {
        return this.delete(`repos/${owner}/${repo}`);
    }

    getUserTeams(username: string): rp.RequestPromise {
        return this.get(`users/${username}/orgs`)
    }

    getUserRepositories(username: string): any {
        return this.get(`users/${username}/repos`).then((data: any) => {
            return new Promise<string[]>((resolve, reject) => {
                resolve(<string[]> data);
            });
        })
    }

}

