
export class TypeOf<V,T> {
    constructor(private val: V) {}

    equals(otherVal: any): boolean { return this.val === otherVal }

    is(otherVal: T): boolean { return this.val === <any> otherVal }

    toString(): string { return typeof this.val.toString === 'function' ? this.val.toString() : (<any> this.val); }

    static create(val: any): TypeOf<any,any> { return <any> new TypeOf(val);}
}
