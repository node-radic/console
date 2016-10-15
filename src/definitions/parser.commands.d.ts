import { ICommandsDefinition } from "./definition.commands";
import { IParsedOptionsDefinition, IOptionsDefinitionParser, ParsedOptionsDefinition, OptionsDefinitionParser } from "./parser.options";
import { Command, Group, ICommandFactory } from "../commands";
export interface IParsedCommandsDefinition extends IParsedOptionsDefinition {
    definition: ICommandsDefinition;
    isCommand: boolean;
    isGroup: boolean;
    isRoot: boolean;
    command: Command;
    group: Group;
}
export interface ICommandsDefinitionParser extends IOptionsDefinitionParser {
    definition: ICommandsDefinition;
    parse(): IParsedCommandsDefinition;
}
export declare class ParsedCommandsDefinition extends ParsedOptionsDefinition implements IParsedCommandsDefinition {
    definition: ICommandsDefinition;
    isRoot: boolean;
    isCommand: boolean;
    isGroup: boolean;
    command: Command;
    group: Group;
}
export declare class CommandsDefinitionParser extends OptionsDefinitionParser implements ICommandsDefinitionParser {
    parsed: IParsedCommandsDefinition;
    definition: ICommandsDefinition;
    factory: ICommandFactory;
    protected query: string[];
    parse(): IParsedCommandsDefinition;
}
