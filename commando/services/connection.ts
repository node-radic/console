import { StringType } from "@radic/util";
import { inject, provide, COMMANDO, provideSingleton } from "../core";
import { Model, Repository, model } from "./database";
import { IRemote, RemoteFactory, AuthMethod, RemoteType } from "./remote";
// import * as rp from "request-promise";
// export {RequestPromise, Options as RequestOptions} from "request-promise";
// export {StatusCodeError} from "request-promise/errors";


@provideSingleton(COMMANDO.CONNECTIONS)
export class ConnectionRepository extends Repository<Connection> {
    getModelID() { return 'connection' }
}


@model('connection', {
    table  : 'connections',
    columns: {
        name  : 'unique:connection',
        method: 'required',
        remote: 'required',
        key   : 'required',
        type  : 'required string',
        secret: 'string',
        extra : 'object'
    },
    key    : {
        name: 'name',
        type: 'string',
        auto: true
    }
})

@provide(COMMANDO.CONNECTION)
export class Connection extends Model {
    name: string
    method: string
    remote: string
    key: string
    secret: string
    // type: RemoteType | string

    _extra: string = '{}'
    get extra(): Object|any { return JSON.parse(this._extra) }

    set extra(val: Object|any) { this._extra = JSON.stringify(val) }

    getMethod() {
        return AuthMethod[ this.method ]
    }

    getRemote<T extends IRemote>(): T {
        return this.remotes.create<T>(this.remote, this)
    }

    get type(): RemoteType | string | undefined {
        if(!this.remote) return undefined
        return this.getRemote().type;
    }

    set type(val:RemoteType | string | undefined){

    }

    @inject(COMMANDO.REMOTES)
    protected remotes: RemoteFactory;

    @inject(COMMANDO.CONNECTIONS)
    protected repository: ConnectionRepository

}
//
// export interface IRawConnection {
//     name: string
//     method: string
//     remote: string
//     key: string
//     secret: string
//     extra: string
// }
//
// export interface IConnection {
//     name: string
//     method: AuthMethod
//     remote: IRemote
//     key: string
//     secret: string
//     extra: Object
// }
//
// export class Connections {
//
//     table: string = 'connections'
//
//     key: TableKey = {
//         name: 'name',
//         type: 'string',
//         auto: false
//     }
//
//     @inject(COMMANDO.DATABASE)
//     protected database: Database
//
//     @inject(COMMANDO.REMOTES)
//     protected remotes: RemoteFactory;
//
//     _query: CommandoDatabaseQuery<IConnection>;
//     get query(): CommandoDatabaseQuery<IConnection> {
//         return this._query ? this._query : this._query = this.database.get(this.table);
//     }
//
//
//     has(name:string) :boolean {
//         return this.get(name) !== undefined
//     }
//
//     get(name:string) : IConnection | undefined {
//         return this.query.find({name: name}).value<IConnection>()
//     }
//
//     create(data:any){
//
//     }
//
//     update(data:any){
//
//     }
//
//     delete(name:string){
//
//     }
//
//     // to db
//     protected serialize(data:IConnection) : any {
//         let serialized:any = _.pick(data, ['name', 'key', 'secret'])
//         serialized.method = data.method.toString()
//         serialized.remote = data.remote.name
//         serialized.extra = JSON.stringify(data.extra)
//         return serialized;
//     }
//
//     // from db
//     protected deserialize(data) : IConnection {
//         data.method = typeof data.method === 'string' ? AuthMethod[ data.method ] : data.method
//         data.remote = typeof data.remote === 'string' ? this.remotes.create(data.remote, this)  : data.remote
//         data.extra = typeof data.extra === 'string' ? JSON.parse(data.extra) : data.extra
//         return data;
//     }
// }
//
