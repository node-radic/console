import { remote, RemoteExtra, RestRemote, AuthMethod } from "../remote";

export class BitbucketServerExtra extends RemoteExtra {

    getName(): string {return 'url' }

    getPrettyName(): string {return 'Bitbucket Server Base URL'}
}

@remote('bitbucket_server', 'Bitbucket Server', 'git')
export class BitbucketServerRemote extends RestRemote {
    getAuthMethods() { return [ AuthMethod.basic, AuthMethod.oauth2, AuthMethod.oauth ] }

    usesExtra       = true
    extraDefinition = new BitbucketServerExtra()

    protected init() {
        this.mergeDefaults({
            baseUrl: this.connection.extra,
            auth   : { username: this.connection.key, password: this.connection.secret }
        })
    }

}
