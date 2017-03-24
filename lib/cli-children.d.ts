export declare type OptionType = 'string' | 'boolean' | 'number';
export interface OptionConfig {
    type?: OptionType;
    array?: boolean;
    default?: any;
    alias?: string;
}
export declare type ArgumentType = 'string' | 'number' | 'boolean';
export interface ArgumentConfig {
    name?: string;
    required?: boolean;
    type?: ArgumentType;
    default?: any;
}
export interface CliChildConfig {
    name?: string;
    group?: GroupConfig;
    cls?: any;
    options?: {
        [name: string]: OptionConfig;
    };
}
export interface GroupConfig extends CliChildConfig {
    globalOptions?: {
        [name: string]: OptionConfig;
    };
    handle?: (group: Group) => boolean;
}
export interface CommandConfig extends CliChildConfig {
    arguments?: {
        [name: string]: ArgumentConfig;
    };
    handle?: (command: Command) => boolean;
}
export interface Options {
    [name: string]: any;
    has: (name: string) => boolean;
    get: <T extends any>(name: string, defaultValue?: any) => T;
}
export interface Arguments {
    [name: string]: any;
    has: (name: string) => boolean;
    get: <T extends any>(name: string, defaultValue?: any) => T;
}
export declare class Group {
    options: Options;
}
export declare class Command {
    arguments: Arguments;
    options: Options;
}
