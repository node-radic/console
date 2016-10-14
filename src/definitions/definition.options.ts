import {merge, mergeWith, isArray, clone} from "lodash";
import {injectable} from "../core";
import {IArgvParserOptions} from "./parser.argv";
// import {IHelpWriter} from "../core/help.writer";

export interface IOptionsDefinition
{
    reset()
    array(v: string|string[]): this
    boolean(v: string|string[]): this
    count(v: string|string[]): this
    number(v: string|string[]): this
    string(v: string|string[]): this
    alias(x: any, y?: string): this
    default(k: string, val: any): this
    option(k: string, o: any): this
    options(options: any): this
    getOptions(): IArgvParserOptions
    getJoinedOptions(): IJoinedOptions
    mergeOptions(definition: IOptionsDefinition): this

    helpKey?: string;
    help(key: string, alias: string, fn?: Function): this
    help(key: string, fn?: Function): this
    isHelpEnabled(): boolean
    showHelp(...without: string[]): void
}
export interface IJoinedOptions {
    [key:string]:IJoinedOption
}
export interface IJoinedOption {
    type?: string
    alias?: string[]
    desc?: string
    default?: any
    narg?: number
}
@injectable()
export class OptionsDefinition implements IOptionsDefinition
{
    //@inject(BINDINGS.HELP_WRITER)
    // helpWriter: IHelpWriter
    helpKey: string
    protected _options: IArgvParserOptions

    constructor() {
        this.reset()
    }

    reset() {
        this._options = {
            alias  : {},
            array  : [],
            boolean: [],
            count  : [],
            coerce : {},
            default: {},
            narg   : {},
            number : [],
            string : [],
            nested : [],
            desc   : {}
        }
    }

    getJoinedOptions() : IJoinedOptions {
        let opts = this._options;
        let joined:IJoinedOptions = {};
        ['array', 'boolean', 'count', 'number', 'nested'].forEach((type: string) => {
            if (typeof opts[type] === "undefined") return;
            opts[type].forEach((key: string) => {
                if (typeof joined[key] === "undefined") {
                    joined[key] = {}
                }

                merge(joined[key], {
                    type,
                    alias: opts.alias[key] || [],
                    desc: opts.desc[key] || '',
                    default: opts.default[key] || false,
                    narg: opts.narg[key] || 0,
                });
            })
        });
        return joined;
    }

    // help
    help(key: string, ...args: any[]): this {
        this.helpKey = key;
        this.boolean(key);
        args.forEach((arg: any) => {
            if (typeof arg === 'string') {
                this.alias(key, arg);
            } else {
                // function
            }
        })
        return this
    }

    isHelpEnabled() {
        return typeof this.helpKey === 'string'
    }

    showHelp(...without: string[]): void {
    }


    // options

    private _push(option, value): this {
        this._options[option].push.apply(this._options[option], [].concat(value));
        return this;
    }

    mergeOptions(definition: this): this {
        let customizer = (objValue: any, srcValue: any, key: any, object: any, source: any, stack: any) => {
            if (isArray(objValue)) {
                return objValue.concat(srcValue)
            }
        }
        mergeWith(this._options, definition.getOptions(), customizer);

        return this;
    }

    getOptions(): IArgvParserOptions {
        return this._options;
    }

    array(bools: string|string[]): this { return this._push('array', bools) }

    boolean(bools: string|string[]): this { return this._push('boolean', bools)}

    count(bools: string|string[]): this { return this._push('count', bools)}

    number(bools: string|string[]): this { return this._push('number', bools)}

    string(bools: string|string[]): this { return this._push('string', bools)}

    nested(bools: string|string[]): this { return this._push('nested', bools)}

    alias(x: any, y?: string): this {
        if (typeof x === 'object') {
            Object.keys(x).forEach((key) => this.alias(key, x[key]));
        } else {
            this._options.alias[x] = (this._options.alias[x] || []).concat(y);
        }
        return this
    }

    coerce(): this {
        return this
    }

    default(k: string, val: any): this {
        this._options.default[k] = val;
        return this
    }

    describe(k: string, val: string): this {
        this._options.desc[k] = val;
        return this
    }


    option(k: string, o: any): this {
        if (o.boolean) this.boolean(k);
        if (o.count) this.count(k);
        if (o.number) this.number(k);
        if (o.string) this.string(k);
        if (o.nested) this.nested(k);
        if (o.alias) this.alias(k, o.alias);
        if (o.coerce) this.coerce();
        if (o.default) this.default(k, o.default);
        if (o.desc) this.describe(k, o.desc)
        return this;
    }

    options(options: any): this {
        Object.keys(options).forEach((key: string) => {
            this.option(key, options[key]);
        })
        return this

    }

}
