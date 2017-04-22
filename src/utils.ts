import * as _ from "lodash";
import {interfaces as i} from './interfaces'

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
    let alias: string[] = keys;
    let name: string    = alias.sort((a, b) => a.length - b.length).shift()
    return _.merge({
        type  : Boolean,
        config: { name, alias },
        key   : name,
        cls   : nodeConfig.cls
    }, decoratedConfig)
}