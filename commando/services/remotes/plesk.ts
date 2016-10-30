import {remote, RemoteExtra, RestRemote,AuthMethod } from "../remote";

@remote('plesk', 'Plesk')
export class PleskRemote extends RestRemote {
    getAuthMethods(){ return  [AuthMethod.basic, AuthMethod.oauth2, AuthMethod.oauth] }
    usesExtra = false

    protected init() {
        this.mergeDefaults({
            baseUrl: this.connection.extra,
            auth   : {username: this.connection.key, password: this.connection.secret}
        })
    }

}
