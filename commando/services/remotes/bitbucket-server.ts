
import {remote, RemoteExtra, Remote } from "../connection.remote";
import { AuthMethod } from "../connection";


export class BitbucketServerExtra extends RemoteExtra {
    name = 'url'
    prettyName = 'Bitbucket Server Base URL'
}

@remote('bitbucket_server', 'Bitbucket Server')
export class BitbucketServerRemote extends Remote {
    authMethods    = [AuthMethod.basic, AuthMethod.oauth2, AuthMethod.oauth]
    usesExtra = true
    extraDefinition = new BitbucketServerExtra()

    protected init() {
        _.merge(this.defaultRequestOptions, {
            baseUrl: this.connection.extra,
            auth   : {username: this.connection.key, password: this.connection.secret}
        })
    }

}
