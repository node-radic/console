import { OptionsDefinition, IOptionsDefinition } from "./definition.options";
import { ICommandFactory, ICommandRegistration, IGroupConstructor, ICommandConstructor } from "../commands";
export interface ICommandsDefinition extends IOptionsDefinition {
    factory: ICommandFactory;
    getCommands(): ICommandRegistration<ICommandConstructor>[];
    getGroups(): ICommandRegistration<IGroupConstructor>[];
}
export declare class CommandsDefinition extends OptionsDefinition implements ICommandsDefinition {
    factory: ICommandFactory;
    getCommands(): ICommandRegistration<ICommandConstructor>[];
    getGroups(): ICommandRegistration<IGroupConstructor>[];
}
