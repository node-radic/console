import * as _ from 'lodash'
import {remote, RemoteExtra, RestRemote,AuthMethod } from "../remote";


@remote('bitbucket', 'Bitbucket', "git")
export class BitbucketRemote extends RestRemote {
    getAuthMethods(){ return  [AuthMethod.basic, AuthMethod.oauth2, AuthMethod.oauth] }
    usesExtra = false

    protected init() {
        this.mergeDefaults({
            baseUrl: 'https://bitbucket.org',
            auth   : {username: this.connection.key, password: this.connection.secret}
        })
    }

}
