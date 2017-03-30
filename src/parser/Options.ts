import { interfaces } from "../interfaces";
import { OptionType } from "../core/nodes";
import { TypeOf } from "../utils";
import { Registry } from "../core/registry";
import { Container } from "../core/ioc";
import { config } from "../config";
export default class Options implements interfaces.Options {

    [key: string]: any

    constructor(options: interfaces.YargsOutputArgv, public _config: { [name: string]: interfaces.OptionConfig }) {

        Object.keys(options).forEach(key => {
            if ( key === '_' ) return;
            this[ key ] = options[ key ];
        })
    }

    has(name: string): boolean {
        return this[ name ] !== undefined
    }

    get<T>(name: string, defaultValueOverride?: any): T {
        return this.has(name) ? this[ name ] : defaultValueOverride;
    };

    isEmpty():boolean{
        return this.getKeys().length === 0
    }

    getKeys(): string[] {
        return Object.keys(this);
    }

    getConfig(name: string): interfaces.OptionConfig {
        return this._config[ name ];
    }

    protected typeOf(name: string): TypeOf<string, OptionType> {
        return TypeOf.create(this._config[ name ].type)
    }
}

