import { interfaces } from "../interfaces";
import { ArgumentType } from "../core/nodes";
import { TypeOf } from "../utils";
export default class Arguments implements interfaces.Arguments {
    [key: string]: any

    constructor(args: { [name: string]: any }, public _config: { [name: number]: interfaces.ArgumentConfig }) {
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

    isEmpty():boolean{
        return this.getKeys().length === 0
    }

    getKeys(): string[] {
        return Object.keys(this);
    }

    getConfig(name:string) : interfaces.ArgumentConfig {
        return this._config[name];
    }

    protected typeOf(name: string): TypeOf<string, ArgumentType> {
        return TypeOf.create(this._config[ name ].type)
    }
}

