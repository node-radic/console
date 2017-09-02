import { HelpersOptionsConfig, CliConfig, CommandConfig, OptionConfig } from "../interfaces";
import { Log } from "./Log";
import { Config } from "./config";
import { ParseArgumentsFunction, SubCommandsGetFunction, TransformOptionsFunction } from "../utils";
import { Helpers } from "./Helpers";
import { Dispatcher } from "./Dispatcher";
export declare class Cli {
    protected _runningCommand: CommandConfig;
    protected _parsedCommands: CommandConfig[];
    protected _rootCommand: CommandConfig;
    protected globalOptions: OptionConfig[];
    protected _argv: string[];
    readonly runningCommand: CommandConfig;
    readonly rootCommand: CommandConfig;
    readonly parsedCommands: CommandConfig[];
    parseCommands: boolean;
    helpers: Helpers;
    events: Dispatcher;
    log: Log;
    config: Config;
    readonly transformOptions: TransformOptionsFunction;
    readonly parseArguments: ParseArgumentsFunction;
    readonly getSubCommands: SubCommandsGetFunction;
    configure(config: CliConfig): this;
    useArgv(argv: string[]): this;
    readonly argv: string[];
    start(requirePath: string): Promise<void>;
    parse(config: CommandConfig): any;
    protected executeCommand(config: CommandConfig): Promise<void>;
    helper<T extends keyof HelpersOptionsConfig>(name: T, config?: HelpersOptionsConfig[T]): this;
    fail(msg?: string): void;
    global(key: string, config: OptionConfig): this;
    global(config: OptionConfig): this;
    globals(configs: OptionConfig[] | {
        [key: string]: OptionConfig;
    }): this;
}
export declare const cli: Cli;
