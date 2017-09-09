/// <reference types="yargs-parser" />
/// <reference types="node" />
import { Cli } from "./Cli";
import { CommandConfig, HelperOptions, OptionConfig, ParsedCommandArguments } from "../interfaces";
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
/**
 * Fires when a helper is getting started but a dependency is missing.
 *
 * If `options.enableDepends === false` then a `HelperDependencyMissingError` will be thrown.
 * This can be countered by canceling, which will make it so that the depended helper will **NOT** start, but the program  **WILL** continue.
 *
 * Refer to the `Helpers.startHelper()` method if you want to know more.
 */
export declare class HelperDependencyMissingEvent extends CancelEvent {
    helperName: string;
    dependencyName: string;
    helperOptions: HelperOptions;
    constructor(helperName: string, dependencyName: string, helperOptions: HelperOptions);
}
/**
 * Fires when a helper class is resolved from the container.
 * This is actually Inversify's binding onActivation being used, which is responsible for setting the configuration on the helper instance.
 * This event is fired AFTER the configuration has been set on the helper instance
 *
 * It is possible to listen to all helpers triggering this event using the event wildcard:
 * `helper:resolved:*`
 *
 * It is also possible to listen for a specific helper triggering this event:
 * `helper:resolved:<name>`
 * For example, the verbose helper:
 * `helper:resolved:verbose`
 */
export declare class HelperContainerResolvedEvent<T = any> extends Event {
    helper: T;
    options: HelperOptions;
    constructor(helper: T, options: HelperOptions);
}
