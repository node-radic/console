import {remote, RemoteExtra, Remote } from "../connection.remote";
import { AuthMethod } from "../connection";


@remote('plesk', 'Plesk')
export class PleskRemote extends Remote {
    authMethods    = [AuthMethod.basic, AuthMethod.oauth2, AuthMethod.oauth]
    usesExtra = false

    protected init() {
        _.merge(this.defaultRequestOptions, {
            baseUrl: this.connection.extra,
            auth   : {username: this.connection.key, password: this.connection.secret}
        })
    }

}
