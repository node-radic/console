import { Registry } from "./registry";
import { GroupConfig, CommandConfig, OptionConfig, ArgumentConfig } from "./cli-children";
import { Parser, Parsed } from "./parser";
export declare type CliMode = 'group' | 'command';
export interface CliConfig {
    argv?: string[];
    args?: Parsed;
    mode?: CliMode;
}
export interface RootOptionConfig extends OptionConfig {
    global?: boolean;
}
export declare class Cli {
    private _registry;
    private _config;
    private _parser;
    argv: string[];
    args: Parsed;
    constructor(registry: Registry, parser: Parser);
    static getInstance(): Cli;
    parse(argv?: string[]): void;
    dump(): void;
    setConfig(config?: CliConfig): this;
    group(name: string, config?: GroupConfig): GroupConfig;
    command(name: string, config: CommandConfig): CommandConfig;
    option(name: string, config?: RootOptionConfig): this;
    options(options: {
        [name: string]: RootOptionConfig;
    }): this;
    argument(name: any, config?: ArgumentConfig): this;
    arguments(config: {
        [name: string]: ArgumentConfig;
    }): this;
}
