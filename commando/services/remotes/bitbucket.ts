import * as _ from 'lodash'
import {remote, RemoteExtra, Remote } from "../connection.remote";
import { AuthMethod } from "../connection";


@remote('bitbucket', 'Bitbucket')
export class BitbucketRemote extends Remote {
    getAuthMethods(){ return  [AuthMethod.basic, AuthMethod.oauth2, AuthMethod.oauth] }
    usesExtra = false

    protected init() {
        _.merge(this.defaultRequestOptions, {
            baseUrl: 'https://bitbucket.org',
            auth   : {username: this.connection.key, password: this.connection.secret}
        })
    }

}
