import { CommandConfig, HelpHelperOptionsConfig, OptionConfig, OutputColumnsOptions } from "../interfaces";
import { CliExecuteCommandHandleEvent, CliExecuteCommandInvalidArgumentsEvent, CliExecuteCommandParseEvent } from "../core/events";
import { OutputHelper } from "./helper.output";
import { SubCommandsGetFunction } from "../utils";
import { Log } from "../core/Log";
import { Cli } from "../core/Cli";
import { Dispatcher } from "../core/Dispatcher";
export declare class HelpHelper {
    config: HelpHelperOptionsConfig;
    events: Dispatcher;
    cli: Cli;
    log: Log;
    out: OutputHelper;
    createDescriber(command: CommandConfig): CommandDescriber;
    readonly getSubCommands: SubCommandsGetFunction;
    showHelp(config: CommandConfig, options: OptionConfig[]): Promise<void>;
    printCommandTree(label?: string, config?: CommandConfig): void;
    protected getTreeSubcommands(config: CommandConfig): any[];
    getSubcommandsNameTree(config: CommandConfig): any;
    onCommandParse(event: CliExecuteCommandParseEvent): void;
    onCommandHandle(event: CliExecuteCommandHandleEvent): void;
    onInvalidArguments(event: CliExecuteCommandInvalidArgumentsEvent): void;
}
export declare class CommandDescriber {
    command: CommandConfig;
    protected help: HelpHelper;
    protected out: OutputHelper;
    protected readonly config: HelpHelperOptionsConfig;
    protected readonly display: {
        [name: string]: boolean;
        title?: boolean;
        titleLines?: boolean;
        description?: boolean;
        descriptionAsTitle?: boolean;
        usage?: boolean;
        example?: boolean;
        explanation?: boolean;
        arguments?: boolean;
        options?: boolean;
        globalOptions?: boolean;
        commands?: boolean;
        groups?: boolean;
    };
    readonly nl: this;
    write(text: string): this;
    line(text?: string): this;
    protected columns(data: any, options?: OutputColumnsOptions): this;
    usage(): this;
    arguments(): this;
    commands(): this;
    groups(): this;
    globalOptions(): this;
    options(): this;
    description(): this;
    explanation(): this;
    example(): this;
    protected printOptions(options: OptionConfig[]): this;
}
