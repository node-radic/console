import * as Cryptr from "cryptr";
import * as _ from "lodash";
import { readFileSync } from "fs";
import { Config, kindOf } from "@radic/util";
import * as LowDB from "lowdb";
import { injectable, provideSingleton, COMMANDO, inject } from "../core";
import { kernel } from "../../src/core/kernel";
import * as Validation from "validatorjs";

Validation.register('object', (value, req, attr) => {
    console.log('validate object: ', 'value', value, 'req', req, 'attr', attr)
    console.log('validate object: kindOf(value) === "object"', kindOf(value) === 'object')
    return kindOf(value) === 'object'
})

Validation.register('unique', (value, model, column) => {
    console.log('validate unique: ', 'value', value, 'model', model, 'column', column)

    let find       = {}
    find[ column ] = value;
    // let found = getModel(model).query().filter(find).size().value();
    // console.log('validate unique found:', found)

    return false
})


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
    columns: {[name: string]: string|string[]}
    key?: TableKey
    cls?: ModelConstructor
}

let models: {[id: string]: IModelRegistration} = {};

export function model(id: string, info: IModelRegistration) {
    return (cls: Function)=> {
        info         = _.merge({
            id,
            cls,
            columns: {},
            key    : {
                name: 'id',
                type: 'integer',
                auto: true
            }
        }, info)
        models[ id ] = info
    }
}

export function getModel<T extends Model>(modelId) {
    if ( ! models[ modelId ] )
        throw Error('Model does not exist:' + modelId)

    let reg   = models[ modelId ]
    let model = kernel.build<T>(reg.cls);

    model._modelId = modelId
    return model;
}


@injectable()
export abstract class Model {
    _modelId: string

    get _registration(): IModelRegistration {
        let reg = _.find(models, { id: this._modelId });
        let a   = 'a';
        return reg;
    }

    get _rules(): {[column: string]: string|string[]} {
        let rules = _.clone(this._registration.columns);
        this._fields.forEach((name) => {
            if ( rules[ name ] === '' || rules[ name ] === null ) {
                delete rules[ name ]
            }
        })
        return rules;
    }

    get _fields(): string [] { return Object.keys(this._registration.columns) }

    get _table(): string { return this._registration.table }

    get _key(): TableKey { return this._registration.key }


    @inject(COMMANDO.DATABASE)
    protected _database: Database

    getDB(): Database {
        return this._database
    }

    protected _query: CommandoDatabaseQuery<this>;

    query(): CommandoDatabaseQuery<this> {
        return this._query ? this._query : this._query = this.getDB().get(this._table);
    }


    fill(data: any): this {
        _.assignIn(this, _.pick(data, this._fields))
        return this;
    }

    serialize(): any {
        return _.pick(this, this._fields)
    }

    protected get querySelf(): {[key: string]: string} {
        let find               = {}
        find[ this._key.name ] = this[ this._key.name ];
        return find
    }

    save() {
        let find               = {}
        find[ this._key.name ] = this[ this._key.name ];
        this.query().find(find)
        this.query().push(this.serialize()).value()
    }

    validate(): _validatorjs.ValidatorJS {
        return new Validation(this.serialize(), this._registration.columns)
    }

    update() {
        this.query().find(this.querySelf).assign(this.serialize()).value()
    }

    delete() {
        this.query().remove(this.querySelf).value()
    }

}

@injectable()
export abstract class Repository<T extends Model> {
    abstract getModelID(): string;

    model(data?: any): T {
        let model = getModel<T>(this.getModelID())
        if ( data ) model.fill(data);
        return model;
    }

    protected _table: string;
    get table(): string {
        return this._table ? this._table : this._table = this.model()._table
    }

    protected _key: TableKey
    get key(): TableKey {
        return this._key ? this._key : this._key = this.model()._key
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
