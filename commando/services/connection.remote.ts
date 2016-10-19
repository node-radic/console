import { StringType } from "@radic/util";
import * as _ from "lodash";
import { kernel, COMMANDO, provideSingleton } from "../core";
import * as rp from "request-promise";
import { AuthMethod, IConnection } from "./connection";
export { RequestPromise, Options as RequestOptions } from "request-promise";
export { StatusCodeError } from "request-promise/errors";


export interface IRemote {
    name: string
    prettyName: string

    authMethods: AuthMethod[]
    connection: IConnection

    hasExtra: boolean
    extraDefinition ?: RemoteExtra
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

export const enum RemoteType {
    GENERIC, GIT, CI
}

@provideSingleton(COMMANDO.REMOTES)
export class RemoteFactory {
    remotes: {[name: string]: IRemoteRegistration} = {}

    register(name, cls) {
        this.remotes[ name ] = cls
    }

    create<T extends IRemote>(name, connection: IConnection): T {
        let reg           = this.get(name);
        let remote        = kernel.build<T>(reg.cls);
        remote.connection = connection;
        remote.name       = reg.name
        remote.prettyName = reg.prettyName
        return remote;
    }

    has(name) {
        return this.remotes[ name ] !== undefined
    }

    get(name): IRemoteRegistration {
        return this.remotes[ name ];
    }

    names(): string[] {
        return Object.keys(this.remotes);
    }

    all(): IRemoteRegistration[] {
        return _.values(this.remotes);
    }
}

export function remote(name: string, prettyName: string, type: RemoteType = RemoteType.GENERIC) {
    return (cls: IRemoteConstructor) => {
        kernel.get<RemoteFactory>(COMMANDO.REMOTES).register(name, { name, prettyName, cls, type });
    }
}


export abstract class Remote implements IRemote {
    abstract get authMethods(): Array<AuthMethod>

    name: string
    prettyName: string

    hasExtra: boolean = false;
    connection: IConnection


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
        this.init();
    }

    protected init() {

    }

    validate(): boolean | string[] {
        return true;
    }

    request(options: rp.Options): rp.RequestPromise {
        options                        = _.merge(this.defaultRequestOptions, options);
        var request: rp.RequestPromise = rp(options);

        return request;
    }

    get(endpoint: string, params: any = {}): rp.RequestPromise {
        return this.request({ uri: endpoint, qs: params });
    }

    put(endpoint: string, payload: any = {}): rp.RequestPromise {
        return this.request({ method: 'PUT', uri: endpoint, body: payload, json: true })
    }

    patch(endpoint: string, payload: any = {}): rp.RequestPromise {
        return this.request({ method: 'PATCH', uri: endpoint, body: payload, json: true })
    }

    post(endpoint: string, payload: any = {}): rp.RequestPromise {
        return this.request({ method: 'POST', uri: endpoint, body: payload, json: true })
    }

    delete(endpoint: string, params: any = {}): rp.RequestPromise {
        return this.request({ method: 'DELETE', uri: endpoint, qs: params });
    }
}

export abstract class RemoteExtra {
    abstract get name(): string

    abstract get prettyName(): string

    validate(extra: string): boolean {
        return true;
    }

    parse(extra: string): string {
        return extra
    }

    ask(cb: Function) {

    }
}

