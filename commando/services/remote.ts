import { StringType } from "@radic/util";
import * as _ from "lodash";
import { inject, injectable, kernel, COMMANDO, provideSingleton } from "../core";
import * as rp from "request-promise";
import { Connection } from "./connection";
import { BINDINGS, ILog } from "../../src/core";
export { RequestPromise, Options as RequestOptions } from "request-promise";
export { StatusCodeError } from "request-promise/errors";


export class AuthMethod extends StringType {
    static basic  = new AuthMethod('basic')
    static oauth  = new AuthMethod('oauth')
    static oauth2 = new AuthMethod('oauth2')
    static token  = new AuthMethod('token')
    static key    = new AuthMethod('key')


    static getKeyName(method: AuthMethod|string) {
        return AuthMethod.getName(method, true);
    }

    static getSecretName(method: AuthMethod|string) {
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

    private static getName(method: AuthMethod|string, key: boolean = true) {
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

export interface IRemote {
    name: string
    prettyName: string
    connection: Connection
    hasExtra: boolean
    extraDefinition ?: RemoteExtra
    type: RemoteType
    callInit()
    getAuthMethods(): AuthMethod[]
}

export interface IRemoteRegistration {
    name: string
    prettyName: string
    type: RemoteType
    cls: IRemoteConstructor
}

export interface IRemoteConstructor {
    new (): IRemote
}

export type RemoteType = 'generic' | 'git' | 'rest' | 'ci' | 'ssh'


@injectable()
export abstract class Remote implements IRemote {
    abstract getAuthMethods(): AuthMethod[]

    @inject(BINDINGS.LOG)
    log: ILog

    connection: Connection
    name: string
    prettyName: string
    extra: RemoteExtra;
    type: RemoteType;
    hasExtra: boolean = false;
    inited: boolean   = false

    callInit() {
        if ( this.inited ) return false;
        this.inited = true
        this.init();
    }

    protected abstract init() ;

    validate(): boolean | string[] {
        return true;
    }

}

@injectable()
export abstract class RestRemote extends Remote {
    protected defaultRequestOptions: rp.Options = <any> {
        baseUrl: '',
        uri    : '',
        auth   : {
            user    : null,
            password: null
        },
        method : 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        json   : true
    };

    constructor() {
        super()
    }

    mergeDefaults(options: any) {
        this.defaultRequestOptions = _.merge({}, this.defaultRequestOptions, options)
    }

    request(options: rp.Options): Promise<any> {
        options                   = _.merge({}, this.defaultRequestOptions, options);
        var request: Promise<any> = <any> rp(options);
        request.catch(this.onError.bind(this));
        return request;
    }

    onError(res: any) {
        this.log.error('Unknown error', res)
        this.log.debug('Error details', res)
    }

    get(endpoint: string, params: any = {}): Promise<any> {
        return this.request({ uri: endpoint, qs: params });
    }

    put(endpoint: string, payload: any = {}): Promise<any> {
        return this.request({ method: 'PUT', uri: endpoint, body: payload, json: true })
    }

    patch(endpoint: string, payload: any = {}): Promise<any> {
        return this.request({ method: 'PATCH', uri: endpoint, body: payload, json: true })
    }

    post(endpoint: string, payload: any = {}): Promise<any> {
        return this.request({ method: 'POST', uri: endpoint, body: payload, json: true })
    }

    delete(endpoint: string, params: any = {}): Promise<any> {
        return this.request({ method: 'DELETE', uri: endpoint, qs: params })
    }
}

@injectable()
export abstract class GitRestRemote extends RestRemote {

    onError(res: any) {
        // if ( res.error ) {
        //     if(res.error.errors && res.error.errors[ 0 ] && res.error.errors[ 0 ].message)
        //         this.log.error(res.error.errors[ 0 ].message)
        //     else
        //         this.log.error(res.error.message)
        // } else
        if ( res.message ) {
            this.log.error(res.message)
        } else {
            super.onError(res)
        }
        this.log.debug('Error details', res)
    }

    abstract getUserRepositories(username?: string): Promise<any>

    abstract getUserTeams(username?: string): Promise<string[]>

    abstract deleteRepository(owner: string, repo: string): Promise<any>

    abstract createRepository(owner: string, repo: string, opts?: any): Promise<Promise<any>>

    abstract getRepositories(owner?: string): Promise<any>

    abstract getRepository(owner: string, repo: string): Promise<any>

    abstract getUser(username?: string): Promise<any>

    abstract getTeam(team: string): Promise<any>

    abstract getTeamRepositories(team: string): Promise<any>
}


@injectable()
export abstract class RemoteExtra {
    abstract getName(): string

    abstract getPrettyName(): string

    validate(extra: string): boolean {
        return true;
    }

    parse(extra: string): string {
        return extra
    }

    ask(cb: Function) {

    }
}


@provideSingleton(COMMANDO.REMOTES)
export class RemoteFactory {
    remotes: {[name: string]: IRemoteRegistration} = {}

    register(name, cls) {
        this.remotes[ name ] = cls
    }

    create<T extends IRemote>(name, connection: Connection): T {
        let reg           = this.get(name);
        let remote        = kernel.build<T>(reg.cls);
        remote.connection = connection;
        remote.name       = reg.name
        remote.prettyName = reg.prettyName
        remote.type       = reg.type;
        remote.callInit()
        return remote;
    }

    has(name) {
        return this.remotes[ name ] !== undefined
    }

    get(name): IRemoteRegistration {
        return this.remotes[ name ];
    }

    keys(): string[] {
        return Object.keys(this.remotes);
    }

    values(): IRemoteRegistration[] {
        return _.values(this.remotes);
    }

}

export function remote(name: string, prettyName: string, type: RemoteType = 'generic') {
    return (cls: IRemoteConstructor) => {
        kernel.get<RemoteFactory>(COMMANDO.REMOTES).register(name, { name, prettyName, cls, type });
    }
}
