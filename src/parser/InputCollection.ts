import { TypeOf } from "../utils";
abstract class InputCollection<I extends any, T>{
    [key: string]: any

    constructor(args: { [name: string]: any }, public _config: { [key: string]: I }) {
        Object.keys(args).forEach(key => {
            this[ key ] = args[ key ];
        })
    }

    has(name: string): boolean {
        return this[ name ] !== undefined
    }

    get<T>(name: string, defaultValueOverride: any = null): T {
        return this.has(name) ? this[ name ] : defaultValueOverride;
    };

    isEmpty(): boolean {
        return this.getKeys().length === 0
    }

    getKeys(): string[] {
        return Object.keys(this);
    }

    getConfig(name: string): I {
        return this._config[ name ];
    }

    typeOf(name: string): TypeOf<string, T> {
        return TypeOf.create(this._config[ name ].type)
    }
}

export default InputCollection


// class Aa extends InputCollection<interfaces.Arguments, ArgumentType> {}
