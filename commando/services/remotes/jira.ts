import * as _ from 'lodash'
import {remote, RemoteExtra, Remote } from "../connection.remote";
import { AuthMethod } from "../connection";



export class JiraExtra extends RemoteExtra {
    name = 'url'
    prettyName = 'Jira Server Base URL'
}

@remote('jira', 'Jira')
export class JiraRemote extends Remote {
    getAuthMethods(){ return  [AuthMethod.basic, AuthMethod.oauth2, AuthMethod.oauth] }
    usesExtra = false

    protected init() {
        _.merge(this.defaultRequestOptions, {
            baseUrl: this.connection.extra,
            auth   : {username: this.connection.key, password: this.connection.secret}
        })
    }

}
