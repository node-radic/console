/// <reference types="yargs-parser" />
/// <reference types="node" />
import { Cli } from "./Cli";
import { BasePluginConfig, CommandConfig, OptionConfig, ParsedCommandArguments, Plugin } from "../interfaces";
import { YargsParserArgv } from "yargs-parser";
import { ChildProcess } from "child_process";
import { Helpers } from "./Helpers";
export declare abstract class Event {
    event: string | string[];
    readonly cli: Cli;
    constructor(event?: string | string[]);
}
export declare abstract class ExitEvent extends Event {
    private _exit;
    private _exitCode;
    exit(code?: number): void;
    stopIfExit(): this;
    shouldExit(): boolean;
}
export declare abstract class CancelEvent extends Event {
    private _canceled;
    cancel(): void;
    canceled<T>(cb: (event?: this) => T): T | this;
    proceed(cb: () => void): this;
    isCanceled(): boolean;
}
export declare abstract class CancelExitEvent extends ExitEvent {
    private _canceled;
    protected cancel(): void;
    canceled(cb: () => void): this;
    proceed(cb: () => void): this;
    isCanceled(): boolean;
}
export declare class CliStartEvent extends CancelEvent {
    requiredPath: string;
    constructor(requiredPath: string);
}
export declare class CliParseEvent extends CancelExitEvent {
    config: CommandConfig;
    globals: OptionConfig[];
    isRootCommand: boolean;
    constructor(config: CommandConfig, globals: OptionConfig[], isRootCommand: boolean);
}
export declare class CliParsedEvent extends ExitEvent {
    config: CommandConfig;
    globals: OptionConfig[];
    isRootCommand: boolean;
    argv: YargsParserArgv;
    constructor(config: CommandConfig, globals: OptionConfig[], isRootCommand: boolean, argv: YargsParserArgv);
}
export declare class CliSpawnEvent extends ExitEvent {
    args: string[];
    file: string;
    proc: ChildProcess;
    constructor(args: string[], file: string, proc: ChildProcess);
}
export declare class CliExecuteCommandEvent extends CancelEvent {
    config: CommandConfig;
    alwaysRun: null | string;
    constructor(config: CommandConfig, alwaysRun: null | string);
}
export declare class CliExecuteCommandParseEvent extends ExitEvent {
    config: CommandConfig;
    options: OptionConfig[];
    constructor(config: CommandConfig, options: OptionConfig[]);
}
export declare class CliExecuteCommandParsedEvent extends ExitEvent {
    argv: YargsParserArgv;
    config: CommandConfig;
    options: OptionConfig[];
    constructor(argv: YargsParserArgv, config: CommandConfig, options: OptionConfig[]);
}
export declare class CliExecuteCommandInvalidArgumentsEvent<T = any> extends ExitEvent {
    instance: T;
    parsed: ParsedCommandArguments;
    config: CommandConfig;
    options: OptionConfig[];
    constructor(instance: T, parsed: ParsedCommandArguments, config: CommandConfig, options: OptionConfig[]);
}
export declare class CliExecuteCommandHandleEvent<T = any> extends ExitEvent {
    instance: T;
    parsed: ParsedCommandArguments;
    argv: YargsParserArgv;
    config: CommandConfig;
    options: OptionConfig[];
    constructor(instance: T, parsed: ParsedCommandArguments, argv: YargsParserArgv, config: CommandConfig, options: OptionConfig[]);
}
export declare class CliExecuteCommandHandledEvent<T = any> extends ExitEvent {
    result: any;
    instance: T;
    argv: YargsParserArgv;
    config: CommandConfig;
    options: OptionConfig[];
    constructor(result: any, instance: T, argv: YargsParserArgv, config: CommandConfig, options: OptionConfig[]);
}
export declare class CliPluginRegisterEvent<T extends BasePluginConfig = BasePluginConfig> extends CancelEvent {
    plugin: Plugin<T>;
    config: T;
    constructor(plugin: Plugin<T>, config: T);
}
export declare class CliPluginRegisteredEvent<T extends BasePluginConfig = BasePluginConfig> extends Event {
    plugin: Plugin<T>;
    constructor(plugin: Plugin<T>);
}
export declare class HelpersStartingEvent extends CancelEvent {
    helpers: Helpers;
    enabledHelpers: string[];
    constructor(helpers: Helpers, enabledHelpers: string[]);
}
export declare class HelperStartingEvent extends CancelEvent {
    helpers: Helpers;
    name: string;
    constructor(helpers: Helpers, name: string);
}
export declare class HelperStartedEvent extends Event {
    helpers: Helpers;
    name: string;
    constructor(helpers: Helpers, name: string);
}
export declare class HelpersStartedEvent extends Event {
    helpers: Helpers;
    startedHelpers: string[];
    constructor(helpers: Helpers, startedHelpers: string[]);
}
