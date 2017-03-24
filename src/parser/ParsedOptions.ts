
import { interfaces } from "../interfaces";
import { OptionType } from "../cli-children";
import { TypeOf } from "../utils";
import { Registry } from "../registry";
import { Container } from "../ioc";
import { config } from "../config";
export default class ParsedOptions implements interfaces.Options {
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
        return this.has(name) ? this[ name ] : defaultValueOverride !== undefined ? defaultValueOverride : undefined;
    };

    getConfig(name:string) : interfaces.OptionConfig {
        return this._config[name];
    }

    protected typeOf(name: string): TypeOf<string, OptionType> {
        return TypeOf.create(this._config[ name ].type)
    }
}

