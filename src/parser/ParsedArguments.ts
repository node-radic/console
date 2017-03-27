import { interfaces } from "../interfaces";
import { ArgumentType } from "../core/nodes";
import { TypeOf } from "../utils";
export default class ParsedArguments implements interfaces.Arguments {
    [key: string]: any

    constructor(args: { [name: string]: any }, public _config: { [name: number]: interfaces.ArgumentConfig }) {
        Object.keys(args).forEach(key => {
            this[ key ] = args[ key ];
        })
    }

    has(name: string): boolean {
        return this[ name ] !== undefined
    }

    get<T>(name: string, defaultValueOverride?: any): T {
        return this.has(name) ? this[ name ] : defaultValueOverride !== undefined ? defaultValueOverride : undefined;
    };

    getConfig(name:string) : interfaces.ArgumentConfig {
        return this._config[name];
    }

    protected typeOf(name: string): TypeOf<string, ArgumentType> {
        return TypeOf.create(this._config[ name ].type)
    }
}

