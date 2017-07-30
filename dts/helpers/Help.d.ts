import { CommandArgumentConfig, CommandConfig, HelperOptionsConfig, OptionConfig } from "../interfaces";
import { CliExecuteCommandHandleEvent, CliExecuteCommandInvalidArgumentsEvent, CliExecuteCommandParseEvent } from "../core/events";
import { OutputHelper } from "./Output";
import { Log } from "../core/Log";
import { Cli } from "../core/Cli";
import { Dispatcher } from "../core/Dispatcher";
export declare class CommandDescriptionHelper {
    config: HelperOptionsConfig;
    events: Dispatcher;
    cli: Cli;
    log: Log;
    out: OutputHelper;
    showHelp(config: CommandConfig, options: OptionConfig[]): void;
    protected printHelp(config: CommandConfig, options: OptionConfig[]): void;
    protected printArguments(args?: CommandArgumentConfig[]): void;
    protected printTitle(config: CommandConfig): void;
    protected printSubCommands(config: CommandConfig): void;
    protected printGlobalOptions(): void;
    protected printOptions(options: OptionConfig[]): void;
    printCommandTree(label?: string, config?: CommandConfig): void;
    protected getTreeSubcommands(config: CommandConfig): any[];
    getSubcommandsNameTree(config: CommandConfig): any;
    protected getParsedCommandNames(): string[];
    onCommandParse(event: CliExecuteCommandParseEvent): void;
    onCommandHandle(event: CliExecuteCommandHandleEvent): void;
    onInvalidArguments(event: CliExecuteCommandInvalidArgumentsEvent): void;
}
