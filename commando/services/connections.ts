import * as _ from "lodash";
import { kernel, provide, inject, COMMANDO, provideSingleton } from "../core";
import { IModel, Model, IRepository, Repository } from "./database";


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
        auth  : 'string',
        method: 'string',
        key   : 'string',
        secret: 'string',
        extra : 'object'
    }

    constructor(data?: IConnectionFields) {
        super(data);
    }

    fill(data:IConnectionFields){
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
    auth: string
    method: string
    key: string
    secret: string
    extra: Object
}

@provideSingleton(COMMANDO.CONNECTIONS)
export class ConnectionRepository extends Repository<Connection> implements IConnectionRepository {
    table = 'connections'

    createModel(binding){
        return kernel.build(binding)
    }

    add(data: IConnectionFields) {
        data.id = this.getCountRecords()
        this.query.push(data).value();
    }

    getCountRecords():number{
        return parseInt(this.query.size().value<string>())
    }

}


// basic, oauth, etc
class AuthMethod {

}

interface IAuth extends IModel {}

@provide(COMMANDO.AUTH)
class Auth extends Model implements IAuth {
    method: AuthMethod

}

interface IAuthRepository extends IRepository<IAuth> {}

@provideSingleton(COMMANDO.AUTHS)
class AuthRepository extends Repository<Auth> implements IAuthRepository {
    table = 'auths'
}


@provideSingleton(COMMANDO.REMOTES)
class RemoteFactory {
    registerRemote(name, cls) {

    }
}


interface IRemote {
    name: string
}
interface IRemoteConstructor {
    new (): IRemote
}

abstract class Remote implements IRemote {
    abstract get name()
}

class GithubRemote extends Remote {
    name = 'github'
}

