import { CommandConfig, HelperOptionsConfig, OptionConfig } from "../interfaces";
import { Log } from "./Log";
import { Config } from "./config";
import { Helpers } from "./Helpers";
import { Dispatcher } from "./Dispatcher";
export declare class Cli {
    protected _runningCommand: CommandConfig;
    protected _parsedCommands: CommandConfig[];
    protected _rootCommand: CommandConfig;
    protected globalOptions: OptionConfig[];
    readonly runningCommand: CommandConfig;
    readonly rootCommand: CommandConfig;
    readonly parsedCommands: CommandConfig[];
    parseCommands: boolean;
    helpers: Helpers;
    events: Dispatcher;
    log: Log;
    config: Config;
    start(requirePath: string): this;
    parse(config: CommandConfig): this;
    protected executeCommand(config: CommandConfig, isAlwaysRun?: boolean): Promise<any>;
    helper(name: string, config?: HelperOptionsConfig): this;
    fail(msg?: string): void;
    global(key: string, config: OptionConfig): this;
    global(config: OptionConfig): this;
    globals(configs: OptionConfig[] | {
        [key: string]: OptionConfig;
    }): this;
}
export declare const cli: Cli;
