import {remote, RemoteExtra, RestRemote,AuthMethod } from "../remote";

@remote('jenkins', 'Jenkins')
export class JenkinsRemote extends RestRemote {
    getAuthMethods(){ return  [AuthMethod.basic, AuthMethod.oauth2, AuthMethod.oauth] }
    usesExtra = false

    protected init() {
        this.mergeDefaults({
            baseUrl: this.connection.extra,
            auth   : {username: this.connection.key, password: this.connection.secret}
        })
    }

}
