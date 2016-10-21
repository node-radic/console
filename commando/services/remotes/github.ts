import { Remote, remote } from "../connection.remote";
import * as BB from "bluebird";
import { AuthMethod } from "../connection";
import * as rp from "request-promise";

@remote('github', 'Github')
export class GithubRemote extends Remote {
    usesExtra   = false
    getAuthMethods(){ return  [AuthMethod.basic, AuthMethod.oauth2, AuthMethod.oauth] }

    protected init() {
        _.merge(this.defaultRequestOptions, {
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

    getUserTeams(username: string) {
        return this.get(`users/${username}/orgs`).then((data: any) => {
            return data;
        });
    }

    getUserRepositories(username: string) {
        return this.get(`users/${username}/repos`).then((data: any) => {
            let defer = BB.defer();
            defer.resolve(data);
            return defer.promise;
        })
    }


}

