import { OptionsDefinition, IOptionsDefinition } from "./definition.options";
import { ICommandFactory, ICommandRegistration, IGroupConstructor, ICommandConstructor } from "../commands";
import { inject, BINDINGS } from "../core";


export interface ICommandsDefinition extends IOptionsDefinition
{
    getCommands(): ICommandRegistration<ICommandConstructor>[]
    getGroups(): ICommandRegistration<IGroupConstructor>[]
}

export class CommandsDefinition extends OptionsDefinition implements ICommandsDefinition
{
    @inject(BINDINGS.COMMANDS_FACTORY)
    factory: ICommandFactory;

    getCommands() {
        return this.factory.commands;
    }

    getGroups() {
        return this.factory.groups;
    }

}
