import Axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import * as _ from "lodash";
import { StringType } from "@radic/util";


export class AuthMethod extends StringType {
    static basic  = new AuthMethod('basic')
    static oauth  = new AuthMethod('oauth')
    static oauth2 = new AuthMethod('oauth2')
    static token  = new AuthMethod('token')
    static key    = new AuthMethod('key')


    static getKeyName(method: AuthMethod | string) {
        return AuthMethod.getName(method, true);
    }

    static getSecretName(method: AuthMethod | string) {
        return AuthMethod.getName(method, false);
    }

    equals(method: any): boolean {
        if ( typeof method === 'string' ) {
            return this.value === method
        }
        if ( method instanceof AuthMethod ) {
            return this.value === method.value;
        }
        return false;
    }

    private static getName(method: AuthMethod | string, key: boolean = true) {
        switch ( true ) {
            case method == AuthMethod.basic:
                return key ? 'username' : 'password'
            case method == AuthMethod.oauth:
                return key ? 'key' : 'secret'
            case method == AuthMethod.oauth2:
                return key ? 'id' : 'secret'
            case method == AuthMethod.token:
                return key ? 'username' : 'token'
            case method == AuthMethod.key:
                return key ? 'username' : 'keyfile'
        }
    }

    get name(): string {
        return this.value
    }

    get keyName(): string {
        return AuthMethod.getKeyName(AuthMethod[ this.value ])
    }
}

export abstract class AbstractGitRestClient {
    protected client: AxiosInstance;
    private config: AxiosRequestConfig;

    constructor() {
        this.client = this.createClient();
    }

    protected createClient(config: AxiosRequestConfig = {}): AxiosInstance {
        config = _.merge({
            baseUrl: '',
            timeout: 1000,
            headers: {}
        }, config)
        return Axios.create(config);
    }

    protected configure(config: AxiosRequestConfig) {
        this.config = _.merge(this.config, config)
        this.client = this.createClient(this.config);
    }

    abstract getAuthMethods(): Array<AuthMethod>

    setAuth(method: AuthMethod, loginId: string, loginAuth?: string) {
        switch ( method ) {
            case AuthMethod.basic:
                this.configure({ auth: { username: loginId, password: loginAuth } });
                break;
            case AuthMethod.oauth2:

        }
    }
}

export class GithubRestClient extends AbstractGitRestClient {
    getAuthMethods(): Array<AuthMethod> {
        return [ AuthMethod.basic, AuthMethod.token ];
    }

}


export class Rest {

}

