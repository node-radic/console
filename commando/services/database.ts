import * as Cryptr from "cryptr";
import * as _ from 'lodash';
import { readFileSync } from "fs";
import { Config } from "@radic/util";
import * as LowDB from "lowdb";
import { injectable, provideSingleton, COMMANDO, inject } from "../core";
import { kernel } from "../../src/core/kernel";

export interface CommandoDatabaseQuery<T> extends LowDB.LoDashWrapper {
}
export interface CommandoDatabase extends LowDB.Low {}


/**
 * Encrypted JSON database
 */
@provideSingleton(COMMANDO.DATABASE)
export class Database {
    protected _db: LowDB.Low;
    protected cryptr;

    // @inject(COMMANDO.PATHS)
    // protected paths;
    //
    // @inject(COMMANDO.KEYS)
    // protected keys;

    constructor(@inject(COMMANDO.PATHS) protected paths,
                @inject(COMMANDO.KEYS) protected keys) {
        this.cryptr = new Cryptr(this.keys.public)

        this._db = require('lowdb')(this.paths.userDatabase, {
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
            connections: []
        }).value()
        // let defaults = {
        //     connections: [],
        //     auths      : []
        // };
        // this._db.setState(_.merge(defaults, this._db.getState()));

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


    get(name) {
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


export interface ModelConstructor {
    new(): Model
}

export interface TableKey {
    name: string
    type: 'numeric' | 'guid' | 'string'
    auto: boolean
}

export type ModelKeyType = 'string' | 'number' |  'guid'

export interface IModelRegistration {
    table: string
    fields: string[]
    key?: TableKey
    cls?: ModelConstructor
}
let models: {[id: string]: IModelRegistration} = {};

export function model(id: string, info: IModelRegistration) {
    return (cls: Function)=> {
        info         = _.merge({
            id,
            cls,
            key: {
                name: 'id',
                type: 'integer',
                auto: true
            }
        }, info)
        models[ id ] = info
    }
}


@injectable()
export abstract class Model {
    _modelId:string

    getRegistration() :IModelRegistration {
        let reg = _.find(models, { id: this._modelId });
        let a = 'a';
        return reg;
    }


    getFields() : string[] {
        return this.getRegistration().fields
    }

    getTable() : string {
        return this.getRegistration().table
    }

    getKey() : TableKey {
        return this.getRegistration().key
    }

    @inject(COMMANDO.DATABASE)
    protected _database: Database

    getDB() : Database {
        return this._database
    }

    protected _query: CommandoDatabaseQuery<this>;
    protected get query(): CommandoDatabaseQuery<this> {
        return this._query ? this._query : this._query = this.getDB().get(this.getTable());
    }


    fill(data: any): this {
        _.assignIn(this, _.pick(data, this.getFields()))
        return this;
    }

    serialize(): any {
        return _.pick(this, this.getFields())
    }

    protected get querySelf(): {[key: string]: string} {
        let find              = {}
        find[ this.getKey().name ] = this[ this.getKey().name ];
        return find
    }

    save() {
        this.query.push(this.serialize()).value()
    }

    update() {
        this.query.find(this.querySelf).assign(this.serialize()).value()
    }

    delete() {
        this.query.remove(this.querySelf).value()
    }

}

@injectable()
export abstract class Repository<T extends Model> {
    abstract getModelID(): string;

    model(data?: any): T {
        let reg = models[this.getModelID()]
        let model = kernel.build<T>(reg.cls);
        model._modelId = this.getModelID()
        if ( data ) model.fill(data);
        return model;
    }

    protected _table:string;
    get table(): string {
        return this._table ? this._table : this._table = this.model().getTable()
    }

    protected _key:TableKey
    get key(): TableKey {
        return this._key ? this._key : this._key = this.model().getKey()
    }

    @inject(COMMANDO.DATABASE)
    protected db: Database

    _query: CommandoDatabaseQuery<T>;
    get query(): CommandoDatabaseQuery<T> {
        return this._query ? this._query : this._query = this.db.get(this.table);
    }

    has(name: string): boolean {
        return this.get(name) !== undefined
    }

    get(name: string): T | undefined {
        return <any> this.findBy(this.key.name, name);
    }

    all(): T[] {
        let all = <any> this.query.value();
        if ( all.length > 0 ) return all.map((data: any) => this.model(data))
        return [];
    }

    find(keyValue): T | null {
        let find              = {}
        find[ this.key.name ] = keyValue
        return this.query.find(find).value<T>()
    }

    findBy(key: string, value: string) {
        let find    = {}
        find[ key ] = value
        return this.query.find(find).value()
    }

    filter(filter: any = {}) {
        return this.query.filter(filter).value();
    }

    count(): number {
        return parseInt(this.query.size().value<string>())
    }

}
