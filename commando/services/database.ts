import * as Cryptr from "cryptr";
import * as _ from "lodash";
import { readFileSync } from "fs";
import { Config, kindOf, IConfigProperty } from "@radic/util";
import * as LowDB from "lowdb";
import { injectable, provideSingleton, COMMANDO, inject, paths } from "../core";
import { kernel } from "../../src";
import * as Validation from "validatorjs";
import { copySync, writeJsonSync } from "fs-extra";
import { resolve } from "path";
import * as moment from 'moment';
import globule = require("globule");
import { join } from "path";


let models: {[id: string]: IModelRegistration} = {};

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
export interface CommandoDatabase extends LowDB.Low {

}


/**
 * Encrypted JSON database
 */
@provideSingleton(COMMANDO.DATABASE)
export class Database {
    protected _db: LowDB.Low;
    protected cryptr;


    constructor(@inject(COMMANDO.PATHS) protected paths,
                @inject(COMMANDO.KEYS) protected keys,
                @inject(COMMANDO.CONFIG) protected config: IConfigProperty) {
        this.cryptr = new Cryptr(this.keys.public)

        this._db = require('lowdb')(this.paths.userDatabase, {
            format: {
                deserialize: (str) => {
                    const decrypted = this.cryptr.decrypt(str)
                    const obj       = JSON.parse(decrypted)

                    if ( this.config('debug') === true ) {
                        writeJsonSync(this.paths.userDatabase + '.debug.json', obj)
                    }
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

    drop(): this {
        this.setState({})
        return this
    }

    getState(): Object {
        return this._db.getState()
    }

    setState(state): this {
        this._db.setState(state)
        return this;
    }

    write(source?: string): this {
        this._db.read(source)
        return this;
    }

    read(source?: string): this {
        this._db.read(source)
        return this;
    }

    backup(backupPath?: string): string {
        backupPath = backupPath || resolve(paths.dbBackups, moment().format('Y/M/D/HH-mm-ss.[db]'));
        copySync(paths.userDatabase, backupPath);
        return backupPath
    }

    listBackups() {
        return globule.find(join(paths.dbBackups, '**/*.db'));
    }

    restore(restorePath: string): this {
        this.write(resolve(restorePath));
        return this
    }

    getModels(): {[id: string]: IModelRegistration} {
        return models
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
        return models[ this._modelId ];
    }

    get _rules(): {[column: string]: string|string[]} {
        let rules = _.clone(this._registration.columns);
        this._columns.forEach((name) => {
            if ( rules[ name ] === '' || rules[ name ] === null ) {
                delete rules[ name ]
            }
        })
        return rules;
    }

    get _columns(): string [] { return Object.keys(this._registration.columns) }

    get _table(): string { return this._registration.table }

    get _key(): TableKey { return this._registration.key }


    @inject(COMMANDO.DATABASE)
    protected _database: Database

    getDB(): Database {
        return this._database
    }

    protected _query: CommandoDatabaseQuery<this>;

    query(): CommandoDatabaseQuery<this> {
        // kernel.get<any>(BINDINGS.OUTPUT).dump(this._modelId, this._registration)
        return this._query ? this._query : this._query = this.getDB().get(this._table);
    }


    fill(data: any): this {
        this._columns.forEach((col:string) => {
            if(data[col]) this[col] = data[col]
        })
        // _.assignIn(this, _.pick(data, this._columns))
        return this;
    }

    serialize(): any {
        return _.pick(this, this._columns)
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

    model(data?: any): T | undefined {
        if ( data === undefined ) return undefined
        let model = getModel<T>(this.getModelID())
        if ( data ) model.fill(data);
        return model;
    }


    get columns(): string[] {
        return Object.keys(models[ this.getModelID() ].columns)
    }

    get table(): string {
        return models[ this.getModelID() ].table
    }

    get key(): TableKey {
        return models[ this.getModelID() ].key
    }

    @inject(COMMANDO.DATABASE)
    protected db: Database

    _query: CommandoDatabaseQuery<T>;
    get query(): CommandoDatabaseQuery<T> {
        return this._query ? this._query : this._query = (<CommandoDatabaseQuery<T>> this.db.get(this.table));
    }

    has(name: string): boolean {
        return this.get(name) !== undefined
    }

    get(name: string): T | undefined {
        return this.findBy(this.key.name, name);
    }

    all(): T[] {
        let all = <any> this.query.value();
        if ( all.length > 0 ) return all.map((data: any) => this.model(data))
        return [];
    }

    find(keyValue): T | undefined {
        return this.findBy(this.key.name, keyValue);
    }

    findBy(key: string, value: string): T | undefined {
        let find    = {}
        find[ key ] = value
        // console.log('find', find, 'key', key, value, 'arguments', arguments, 'query', this.query.find(find).value<T>(), 'this.getModelID()', this.getModelID())
        return <T> this.toModel(this.query.find(find).value<T>())
    }

    filter(filter: any = {}): T[] | undefined {
        return <T[]> this.toModel(this.query.filter(filter).value<any[]>());
    }

    count(): number {
        return parseInt(this.query.size().value<string>())
    }

    protected toModel(val: any): T|T[] {
        if ( kindOf(val) === 'array' ) {
            if ( val.length === 0 ) return <any> []
            return val.map((data: any) => this.model(data))
        }
        return <any> this.model(val)
    }

}
