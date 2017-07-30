/// <reference types="node" />
import { Cli } from "./Cli";
import { Dictionary, CommandConfig, HelperOptionsConfig, OptionConfig, ParsedCommandArguments } from "../interfaces";
import { YargsParserArgv } from "../../types/yargs-parser";
import { ChildProcess } from "child_process";
import { Helpers } from "./Helpers";
export declare abstract class Event {
    event: string | string[];
    readonly cli: Cli;
    constructor(event?: string | string[]);
}
export declare abstract class HaltEvent extends Event {
    halt: boolean;
    stop(): void;
}
export declare class CliStartEvent extends HaltEvent {
    requiredPath: string;
    constructor(requiredPath: string);
}
export declare class CliParseEvent extends HaltEvent {
    config: CommandConfig;
    globals: OptionConfig[];
    constructor(config: CommandConfig, globals: OptionConfig[]);
}
export declare class CliParsedEvent extends HaltEvent {
    config: CommandConfig;
    argv: YargsParserArgv;
    globals: OptionConfig[];
    constructor(config: CommandConfig, argv: YargsParserArgv, globals: OptionConfig[]);
}
export declare class CliSpawnEvent extends HaltEvent {
    args: string[];
    file: string;
    proc: ChildProcess;
    constructor(args: string[], file: string, proc: ChildProcess);
}
export declare class CliExecuteCommandParseEvent extends HaltEvent {
    config: CommandConfig;
    options: OptionConfig[];
    constructor(config: CommandConfig, options: OptionConfig[]);
}
export declare class CliExecuteCommandParsedEvent extends HaltEvent {
    argv: YargsParserArgv;
    config: CommandConfig;
    options: OptionConfig[];
    constructor(argv: YargsParserArgv, config: CommandConfig, options: OptionConfig[]);
}
export declare class CliExecuteCommandInvalidArgumentsEvent<T = any> extends HaltEvent {
    instance: T;
    parsed: ParsedCommandArguments;
    config: CommandConfig;
    options: OptionConfig[];
    constructor(instance: T, parsed: ParsedCommandArguments, config: CommandConfig, options: OptionConfig[]);
}
export declare class CliExecuteCommandHandleEvent<T = any> extends HaltEvent {
    instance: T;
    parsed: ParsedCommandArguments;
    argv: YargsParserArgv;
    config: CommandConfig;
    options: OptionConfig[];
    constructor(instance: T, parsed: ParsedCommandArguments, argv: YargsParserArgv, config: CommandConfig, options: OptionConfig[]);
}
export declare class CliExecuteCommandHandledEvent<T = any> extends HaltEvent {
    result: any;
    instance: T;
    argv: YargsParserArgv;
    config: CommandConfig;
    options: OptionConfig[];
    constructor(result: any, instance: T, argv: YargsParserArgv, config: CommandConfig, options: OptionConfig[]);
}
export declare class HelpersStartingEvent extends HaltEvent {
    helpers: Helpers;
    enabledHelpers: string[];
    customConfigs: Dictionary<HelperOptionsConfig>;
    constructor(helpers: Helpers, enabledHelpers: string[], customConfigs: Dictionary<HelperOptionsConfig>);
}
export declare class HelperStartingEvent extends HaltEvent {
    helpers: Helpers;
    name: string;
    customConfig: HelperOptionsConfig;
    constructor(helpers: Helpers, name: string, customConfig: HelperOptionsConfig);
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
