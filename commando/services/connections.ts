import { StringType } from "@radic/util";
import * as _ from "lodash";
import { kernel, provide, inject, COMMANDO, provideSingleton } from "../core";
import { IModel, Model, IRepository, Repository } from "./database";

import * as rp from "request-promise";
export {RequestPromise, Options as RequestOptions} from "request-promise";
export {StatusCodeError} from "request-promise/errors";


export interface IConnection extends IModel {}

@provide(COMMANDO.CONNECTION)
export class Connection extends Model implements IConnection {

    id: number

    @inject(COMMANDO.AUTH)
    auth: IAuth

    method: AuthMethod

    remote: IRemote

    key: string

    secret: string

    fields: {[name: string]: string} = {
        id    : 'number',
        name  : 'string',
        auth  : 'string',
        method: 'string',
        key   : 'string',
        secret: 'string',
        extra : 'object'
    }

    constructor(data?: IConnectionFields) {
        super(data);
    }

    fill(data: IConnectionFields) {
        Object.keys(this.fields).forEach((fieldName: string) => {
            if ( data[ fieldName ] ) {
                // check if attribute has a custom setter
                let setterMethod = 'set' + _.upperFirst(fieldName);
                if ( this[ setterMethod ] ) {
                    return this[ setterMethod ](data[ fieldName ])
                }
                // otherwise just set it
                this[ fieldName ] = data[ fieldName ]
            }
        })
    }

    static create(data: any) {
        return new Connection(data);
    }


}


export interface IConnectionRepository extends IRepository<IConnection> {

}
export interface IConnectionFields {
    id: number
    name: string
    auth: string
    method: string
    key: string
    secret: string
    extra: Object
}

@provideSingleton(COMMANDO.CONNECTIONS)
export class ConnectionRepository extends Repository<Connection> implements IConnectionRepository {
    table = 'connections'

    createModel(): Connection {
        return kernel.build<Connection>(COMMANDO.CONNECTION)
    }

    add(data: IConnectionFields) {
        data.id = this.getCountRecords()
        this.query.push(data).value();
    }

    getCountRecords(): number {
        return parseInt(this.query.size().value<string>())
    }

}

export class AuthMethod extends StringType {
    static basic  = new AuthMethod('basic')
    static oauth  = new AuthMethod('oauth')
    static oauth2 = new AuthMethod('oauth2')
    static token  = new AuthMethod('token')


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
        }
    }

    get name(): string {
        return this.value
    }

    get keyName(): string {
        return AuthMethod.getKeyName(AuthMethod.methods[ this.value ])
    }
}

interface IAuth {
    remote: IRemote
    method: AuthMethod
    key: string
    secret: string
}

@provide(COMMANDO.AUTH)
class Auth implements IAuth {
    remote: IRemote;
    key: string;
    secret: string;
    method: AuthMethod = <AuthMethod> AuthMethod.basic

}


@provideSingleton(COMMANDO.AUTHS)
class AuthFactory {
    create(remote, method, key, secret?: string) {

    }
}



@provideSingleton(COMMANDO.REMOTES)
class RemoteFactory {
    remotes: {[name: string]: IRemoteConstructor} = {}

    register(name, cls) {
        this.remotes[name] = cls
    }

    create<T extends IRemote>(name) : T {
        let cls = this.get(name);
        return kernel.build<T>(cls);
    }

    has(name) {
        return this.remotes[ name ] !== undefined
    }

    get(name) : IRemoteConstructor {
        return this.remotes[ name ];
    }
}

interface IRemoteConstructor {
    new (): IRemote
}


function remote(name: string) {
    return (cls) => {
        kernel.get<RemoteFactory>(COMMANDO.REMOTES).register(name, cls);
    }
}

interface IRemote {
    authMethods: AuthMethod[]
}
abstract class Remote implements IRemote {
    abstract get authMethods(): Array<AuthMethod>
    abstract get usesExtraField():boolean
}

class GithubRemote extends Remote {
    usesExtraField = false
    authMethods = [ AuthMethod.basic, AuthMethod.oauth ]
}

