import * as _ from "lodash";
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
function collect<T>(value: T[]): _.LoDashExplicitArrayWrapper<T>;
function collect<T extends {}>(value: T): _.LoDashExplicitObjectWrapper<T>;
function collect(...params: any[]): _.LoDashExplicitWrapper<any> {
    return _.chain.apply(_, params);
}

export { collect }

