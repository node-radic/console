import { TypeOf } from "../utils";
import { isUndefined } from "util";
import { defined } from "@radic/util";
abstract class InputCollection<I extends any, T>{
    [key: string]: any

    constructor(args: { [name: string]: any }, public __config: { [key: string]: I }) {
        Object.keys(args).forEach(key => {
            this[ key ] = args[ key ];
        })
    }

    has(name: string): boolean {
        return this[ name ] !== undefined
    }

    get<T>(name: string, defaultValueOverride?: any ): T {
        if(this.has(name)) return this[ name ];
        if(defined(defaultValueOverride)) return defaultValueOverride
        let def = this.config(name).default;
        if(defined(def)) return def
    };

    isEmpty(): boolean {
        return this.getKeys().length === 0
    }

    getKeys(): string[] {
        return Object.keys(this);
    }

    config(name?: string): I {
        return this.__config[ name ]
    }

    getConfig(): { [key: string]: I } {
        return this.__config;
    }

    typeOf(name: string): TypeOf<string, T> {
        return TypeOf.create(this.__config[ name ].type)
    }
}

export default InputCollection


// class Aa extends InputCollection<interfaces.Arguments, ArgumentType> {}
