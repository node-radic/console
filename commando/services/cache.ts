import { COMMANDO, inject, provideSingleton } from "../core";
import * as Cryptr from "cryptr";
import { writeFileSync, readFileSync, existsSync } from "fs";

export interface ICache {

    set(key: string, value: any, expire: number|Date)
    get(key: string, defaultValue?: any, expire?: number|Date): any
    has(key: string): boolean
    forget(key: string)
}

@provideSingleton(COMMANDO.CACHE)
export class Cache implements ICache {
    private cryptr;
    protected items: {[key: string]: {expires: Date, value: any}} = {};

    constructor(@inject(COMMANDO.PATHS) protected paths,
                @inject(COMMANDO.KEYS) protected keys) {
        this.cryptr = new Cryptr(this.keys.public)
        if ( ! existsSync(this.paths.userCache) ) {
            this.save()
        } else {
            this.load()
        }
    }

    protected encrypt(obj: any) {
        return this.cryptr.encrypt(JSON.stringify(obj))
    }

    protected decrypt(str: string) {
        return JSON.parse(this.cryptr.decrypt(str))
    }

    protected load() {
        this.items = this.decrypt(readFileSync(this.paths.userCache, 'utf-8'))
        return this
    }

    protected save() {
        writeFileSync(this.paths.userCache, this.encrypt(this.items))
        return this
    }

    set(key: string, value: any, expire?: number|Date) {
        // expire = 300 sec
        let d = new Date
        d.setMinutes(5)
        d.toJSON()
        this.items[key] = {value, expires: d }
    }

    get(key: string, defaultValue?: any, expire?: number|Date): any {
        if(this.has(key)) return this.get(key)
        return undefined;
    }

    has(key: string): boolean {
        return undefined;
    }

    forget(key: string) {
    }

}
