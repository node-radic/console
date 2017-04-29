import * as _ from "lodash";
import { interfaces as i } from "./interfaces";

export class TypeOf<V, T> {
    constructor(private val: V) {}

    equals(otherVal: any): boolean { return this.val === otherVal }

    is(otherVal: T): boolean { return this.val === <any> otherVal }

    toString(): string { return typeof this.val.toString === 'function' ? this.val.toString() : (<any> this.val); }

    static create(val: any): TypeOf<any, any> { return <any> new TypeOf(val);}
}


function collect(value: number): _.LoDashExplicitWrapper<number>;
function collect(value: string): _.LoDashExplicitWrapper<string>;
function collect(value: boolean): _.LoDashExplicitWrapper<boolean>;
function collect(...params: any[]): _.LoDashExplicitWrapper<any> {
    return _.chain.apply(_, params);
}

export { collect }


export function prepareOption(keys: string[], nodeConfig: i.NodeConfig, decoratedConfig: i.DecoratedConfig<i.OptionConfig>): i.DecoratedConfig<i.OptionConfig> {

}


export function meta(obj: Object, prop?: string | symbol) {

    function set(key: any, val?: any) {
        if ( ! val ) {
            Object.keys(key).forEach((k) => set(k, key[ k ]));
        } else {
            Reflect.defineMetadata(key, val, obj);
        }
        return meta(obj);
    }

    function has(key: any) {
        return Reflect.hasMetadata(key, obj, prop)
    }

    function get<T>(key: any, def?: any): T {
        return has(key) ? Reflect.getMetadata(key, obj, prop) : def;
    }

    return { set, has, get }

}


export function randomId(len: number = 15): string {
    let text       = "";
    const possible = "abcdefghijklmnopqrstuvwxyz";

    for ( let i = 0; i < len; i ++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

export function generateClass(){
    let fn     = function () {}
    let desc   = Object.getOwnPropertyDescriptor(fn, 'name');
    desc.value = randomId()
    Object.defineProperty(fn, 'name', desc);
}