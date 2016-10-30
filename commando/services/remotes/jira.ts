import * as _ from 'lodash'
import {remote, RemoteExtra, RestRemote,AuthMethod } from "../remote";


export class JiraExtra extends RemoteExtra {
    getName(): string {
        return 'url';
    }

    getPrettyName(): string {
        return 'URL';
    }
    name = 'url'
    prettyName = 'Jira Server Base URL'
}

@remote('jira', 'Jira')
export class JiraRemote extends RestRemote {
    getAuthMethods(){ return  [AuthMethod.basic, AuthMethod.oauth2, AuthMethod.oauth] }
    usesExtra = false

    protected init() {
        this.mergeDefaults({
            baseUrl: this.connection.extra,
            auth   : {username: this.connection.key, password: this.connection.secret}
        })
    }

}
