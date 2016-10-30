import { COMMANDO, inject, provideSingleton } from "../core";
import * as Cryptr from "cryptr";
import { writeFileSync, readFileSync, existsSync } from "fs";
import * as moment from 'moment';
import { IConfigProperty, kindOf } from "@radic/util";


export interface ICache {

    set(key: string, value: any, duration?: CacheDuration)
    forever(key: string, value: any)
    get(key: string, defaultValue?: any, duration?: CacheDuration): any
    has(key: string): boolean
    forget(key: string)
}


export interface ICacheItem {
    value?: any
    duration?: moment.Duration|null|string
    expires?: moment.Moment|null|string
}

export type CacheDuration = moment.Duration | null


@provideSingleton(COMMANDO.CACHE)
export class Cache implements ICache {
    private cryptr;
    protected items: Map<string,ICacheItem> = new Map

    constructor(@inject(COMMANDO.PATHS) protected paths,
                @inject(COMMANDO.KEYS) protected keys,
                @inject(COMMANDO.CONFIG) protected config: IConfigProperty) {
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
        if ( this.config('debug') === true ) writeFileSync(this.paths.userCache + '.debug.json', JSON.stringify(this.items))
        writeFileSync(this.paths.userCache, this.encrypt(this.items))
        return this
    }


    set(key: string, value: any, duration: CacheDuration = null) {
        this.items.set(key, {
            value,
            duration: duration ? moment.duration(duration).toJSON() : null,
            expires : duration ? moment().add(moment.duration(duration)).toJSON() : null
        })
        this.save()
    }

    get(key: string, defaultValue?: any, duration?: CacheDuration): any {
        // this.load()
        if ( ! this.has(key) && ! defaultValue ) return null;
        if ( ! this.has(key && defaultValue) ) return this.getDefault(key, defaultValue, duration)

        let item: ICacheItem = this.items.get(key)
        item.duration        = item.duration ? moment.duration(item.duration) : null
        item.expires         = item.expires ? moment(item.expires) : null
        return item.value;
    }

    protected getDefault(key: string, defaultValue: any, duration?: CacheDuration): any {
        if(kindOf(defaultValue) === 'function'){
            defaultValue = defaultValue.apply()
        }

        this.set(key, defaultValue, duration)
    }

    has(key: string): boolean {
        if ( ! this.items.has(key) )return false
        let item: ICacheItem = this.items.get(key)
        if ( item.expires && moment(item.expires).isAfter(moment()) ) return false
        return true
    }

    forget(key: string) {
        this.items.delete(key)
    }

    forever(key: string, value: any) {
        this.set(key, value, null)
    }

}
