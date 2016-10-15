import { IArgvParserOptions } from "./parser.argv";
export interface IOption {
    alias?: string;
    array?: boolean;
    boolean?: boolean;
    count?: boolean;
    coerce?: any;
    default?: any;
    narg?: number;
    number?: boolean;
    string?: boolean;
    nested?: boolean;
    desc?: string;
    handler?: Function;
}
export interface IOptionsDefinition {
    reset(): any;
    array(v: string | string[]): this;
    boolean(v: string | string[]): this;
    count(v: string | string[]): this;
    number(v: string | string[]): this;
    string(v: string | string[]): this;
    alias(x: any, y?: string): this;
    default(k: string, val: any): this;
    handler(k: string, val: Function): this;
    option(k: string, o: IOption): this;
    options(options: {
        [k: string]: IOption;
    }): this;
    getOptions(): IArgvParserOptions;
    getJoinedOptions(): IJoinedOptions;
    mergeOptions(definition: IOptionsDefinition): this;
}
export interface IJoinedOptions {
    [key: string]: IJoinedOption;
}
export interface IJoinedOption {
    type?: string;
    alias?: string[];
    desc?: string;
    default?: any;
    narg?: number;
    handler?: Function;
}
export declare class OptionsDefinition implements IOptionsDefinition {
    helpKey: string;
    protected _options: IArgvParserOptions;
    constructor();
    reset(): void;
    getJoinedOptions(): IJoinedOptions;
    private _push(option, value);
    mergeOptions(definition: this): this;
    getOptions(): IArgvParserOptions;
    array(bools: string | string[]): this;
    boolean(bools: string | string[]): this;
    count(bools: string | string[]): this;
    number(bools: string | string[]): this;
    string(bools: string | string[]): this;
    nested(bools: string | string[]): this;
    alias(x: any, y?: string): this;
    coerce(): this;
    default(k: string, val: any): this;
    describe(k: string, val: string): this;
    handler(k: string, v: Function): this;
    option(k: string, o: any): this;
    options(options: any): this;
}
