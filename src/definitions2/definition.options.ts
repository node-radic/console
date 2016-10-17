import { merge, mergeWith, isArray } from "lodash";
import { injectable } from "../core";
import { IArgvParserOptions } from "./parser.argv";
// import {IHelpWriter} from "../core/help.writer";


export interface IOption {
    alias  ?: string,
    array  ?: boolean,
    boolean?: boolean,
    count  ?: boolean,
    coerce ?: any,
    default?: any,
    narg   ?: number,
    number ?: boolean,
    string ?: boolean,
    nested ?: boolean,
    desc   ?: string,
    handler?: Function
}

export interface IOptionsDefinition {
    reset()
    array(v: string|string[]): this
    boolean(v: string|string[]): this
    count(v: string|string[]): this
    number(v: string|string[]): this
    string(v: string|string[]): this
    alias(x: any, y?: string): this
    default(k: string, val: any): this
    handler(k: string, val: Function): this
    option(k: string, o: IOption): this
    options(options: {[k: string]: IOption}): this
    getOptions(): IArgvParserOptions
    getJoinedOptions(): IJoinedOptions
    mergeOptions(definition: IOptionsDefinition): this

    hasHelp(): boolean
    getHelpKey(): string
    help(k: string, a?: string): this
    // showHelp(...without: string[]): void
}
export interface IJoinedOptions {
    [key: string]: IJoinedOption
}
export interface IJoinedOption {
    type?: string
    alias?: string[]
    desc?: string
    default?: any
    narg?: number
    handler?: Function
}
@injectable()
export class OptionsDefinition implements IOptionsDefinition {
    //@inject(BINDINGS.HELP_WRITER)
    // helpWriter: IHelpWriter
    protected _options: IArgvParserOptions
    protected _keys: {[name: string]: boolean}
              _help: {enabled: boolean, key?: string } = { enabled: false, key: undefined }

    hasHelp(): boolean {
        return this._help.enabled;
    }

    getHelpKey(): string {
        return this._help.key;
    }

    constructor() {
        this.reset()
    }

    reset() {
        this._keys    = {}
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
            desc   : {},
            handler: {}
        }
    }


    getJoinedOptions(): IJoinedOptions {
        let opts                   = this._options;
        let joined: IJoinedOptions = {};
        [ 'array', 'boolean', 'count', 'number', 'nested' ].forEach((type: string) => {
            if ( typeof opts[ type ] === "undefined" ) return;
            opts[ type ].forEach((key: string) => {
                if ( typeof joined[ key ] === "undefined" ) {
                    joined[ key ] = {}
                }

                merge(joined[ key ], {
                    type,
                    alias  : opts.alias[ key ] || [],
                    desc   : opts.desc[ key ] || '',
                    default: opts.default[ key ] || false,
                    narg   : opts.narg[ key ] || 0,
                    handler: opts.handler[ key ] || undefined
                });
            })
        });
        return joined;
    }

    help(k, alias) :this {
        this._help.enabled = true;
        this._help.key     = k;

        this.option(k, {
            alias, desc: '', handler: (...args: any[]) => {
                console.log('handler')
            }
        })
        return this;
    }

    // options

    private _push(option, value): this {
        [].concat(value).forEach((key: string) => this.registerOption(key))
        this._options[ option ].push.apply(this._options[ option ], [].concat(value));
        return this;
    }

    get keys(): string[] { return Object.keys(this._keys) }

    hasOption(key): boolean { return this._keys[ key ] !== undefined && this._keys[ key ] === true }

    protected registerOption(key, force: boolean = false): this {
        if ( false === this.hasOption(key) || force ) this._keys[ key ] = true
        return this
    }

    mergeOptions(definition: this): this {
        let customizer = (objValue: any, srcValue: any, key: any, object: any, source: any, stack: any) => {
            if ( isArray(objValue) ) {
                return objValue.concat(srcValue)
            }
        }
        mergeWith(this._options, definition.getOptions(), customizer);
        definition.keys.forEach((key) => this.hasOption(key) === false ? this.registerOption(key) : this)
        return this;
    }

    getOptions(): IArgvParserOptions { return this._options; }

    array(bools: string|string[]): this { return this._push('array', bools) }

    boolean(bools: string|string[]): this { return this._push('boolean', bools)}

    count(bools: string|string[]): this { return this._push('count', bools)}

    number(bools: string|string[]): this { return this._push('number', bools)}

    string(bools: string|string[]): this { return this._push('string', bools)}

    nested(bools: string|string[]): this { return this._push('nested', bools)}

    alias(x: any, y?: string): this {
        if ( typeof x === 'object' ) {
            Object.keys(x).forEach((key) => this.alias(key, x[ key ]));
        } else {
            this._options.alias[ x ] = (this._options.alias[ x ] || []).concat(y);
        }
        return this
    }

    coerce(): this {
        return this
    }

    default(k: string, val: any): this {
        this._options.default[ k ] = val;
        return this
    }

    describe(k: string, val: string): this {
        this._options.desc[ k ] = val;
        return this
    }

    handler(k: string, v: Function): this {
        this._options.handler[ k ] = v;
        return this
    }


    option(k: string, o: any): this {
        this.registerOption(k)
        if ( o.boolean ) this.boolean(k);
        if ( o.getCountRecords ) this.count(k);
        if ( o.number ) this.number(k);
        if ( o.string ) this.string(k);
        if ( o.nested ) this.nested(k);
        if ( o.alias ) this.alias(k, o.alias);
        if ( o.coerce ) this.coerce();
        if ( o.default ) this.default(k, o.default);
        if ( o.desc ) this.describe(k, o.desc)
        return this;
    }

    options(options: any): this {
        Object.keys(options).forEach((key: string) => {
            this.option(key, options[ key ]);
        })
        return this

    }

}
