import * as Cryptr from "cryptr";
import { readFileSync } from "fs";
import { Config } from "@radic/util";
import * as LowDB from 'lowdb';
import { injectable, provideSingleton , COMMANDO, inject } from "../core";

export interface CommandoDatabaseQuery<T> extends LowDB.LoDashWrapper {
}
export interface CommandoDatabase extends LowDB.Low{}


/**
 * Encrypted JSON database
 */
@provideSingleton(COMMANDO.DATABASE)
export class Database
{
    protected _db: LowDB.Low;
    protected cryptr;

    // @inject(COMMANDO.PATHS)
    // protected paths;
    //
    // @inject(COMMANDO.KEYS)
    // protected keys;

    constructor(
        @inject(COMMANDO.PATHS) protected paths,
        @inject(COMMANDO.KEYS) protected keys
    ) {
        this.cryptr = new Cryptr(this.keys.public)

        this._db    = require('lowdb')(this.paths.userDatabase, {
            format: {
                deserialize: (str) => {
                    const decrypted = this.cryptr.decrypt(str)
                    const obj       = JSON.parse(decrypted)
                    return obj
                },
                serialize  : (obj) => {
                    const str       = JSON.stringify(obj)
                    const encrypted = this.cryptr.encrypt(str)
                    return encrypted
                }
            }
        });
        this._db.defaults({
            connections: [],
            auths: []
        }).value();

    }

    protected getDB(): CommandoDatabase {
        return this._db
    }

    protected rawDB() {

        let str         = readFileSync(this.paths.userDatabase);
        const decrypted = this.cryptr.decrypt(str)
        const obj       = JSON.parse(decrypted)
        return obj
    }


    get(name){
        return this._db.get(name)
    }

    has(name): boolean | any {
        return this._db.has(name).value()
    }

    raw() {
        return this.rawDB()
    }

    asConfig() {
        new Config(this.rawDB());
    }
}





export interface IModel
{}

@injectable()
export abstract class Model implements IModel
{
    constructor(data?:any){

    }
}

export interface IRepository<T extends IModel>
{
    table: string
    find(...p: any[]): T|null
}

@injectable()
export abstract class Repository<T extends Model> implements IRepository<T>
{

    abstract get table(): string

    abstract set table(val:string)

    @inject(COMMANDO.DATABASE)
    protected database: Database

    query: CommandoDatabaseQuery<T>;

    constructor() {
        // this.query = this.database.get(this.table);
    }

    find(id) : T | null {
        return this.query.find({ id }).value<T>()
    }

}
