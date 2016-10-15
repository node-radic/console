import * as util from "@radic/util";
export interface IBaseConfig extends util.IConfig {
    title(val: string): this;
    description(val: string): this;
    version(val: string): this;
    help(key: string, command?: string): this;
    dump(): any;
}
export interface IConfig extends IBaseConfig {
    (args?: any): any;
}
export declare class Config extends util.Config implements IBaseConfig {
    title(title: string): this;
    version(title: string): this;
    description(title: string): this;
    help(key: string, command?: string): this;
    dump(): void;
    get(prop?: any, def?: any): any;
    static makeProperty(config: IBaseConfig): IConfig;
}
export declare let config: IConfig;
