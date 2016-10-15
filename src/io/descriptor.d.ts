import { IOptionsDefinition, IArgumentsDefinition } from "../definitions";
import { IOutput } from "./output";
import { IConfig, CommandsCli, ArgumentsCli } from "../core";
import { ICommandFactory } from "../commands/factory";
import { IGroup } from "../commands/group";
import { ICommand } from "../commands/command";
export interface IDescriptor {
    cli(cli: any): any;
    getOptions(definition: IOptionsDefinition): CliTable;
    getArguments(definition: IArgumentsDefinition): CliTable;
    options(definition: IOptionsDefinition): this;
    arguments(definition: IArgumentsDefinition): this;
    group(group: string | IGroup): this;
    command(command: ICommand): this;
    getCommandTree(from?: string): any[];
    commandTree(label?: string, from?: string): this;
}
export declare class Descriptor implements IDescriptor {
    out: IOutput;
    config: IConfig;
    factory: ICommandFactory;
    getCommandTree(from?: string): any[];
    commandTree(label?: string, from?: string): this;
    getGroup(group: IGroup | null): CliTable;
    group(group: IGroup): this;
    getCommand(command: any): string;
    command(command: ICommand): this;
    getOptions(definition: IOptionsDefinition): CliTable;
    options(definition: IOptionsDefinition): this;
    getArguments(definition: IArgumentsDefinition): CliTable;
    arguments(definition: IArgumentsDefinition): this;
    protected argumentsCli(cli: ArgumentsCli): void;
    protected commandsCli(cli: CommandsCli): void;
    cli(cli: any): void;
}
