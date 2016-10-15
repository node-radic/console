import { ILog } from "../core";
import { ICommandsDefinition, ICommandsDefinitionParser, IParsedCommandsDefinition, IArgumentsDefinition, IParsedArgumentsDefinition } from "../definitions";
import { IInput, IOutput } from "../io";
import { Cli } from "../core/cli";
import { IGroupConstructor } from "./group";
import { BaseCommandRegistration, ICommandRegistration } from "./factory";
export interface ICommandHelper {
    name: string;
}
export interface ICommand extends ICommandRegistration<ICommand> {
    arguments: any;
    options: any;
    parsed: IParsedArgumentsDefinition;
}
export interface ICommandConstructor {
    new (): ICommand;
}
export declare class Command extends BaseCommandRegistration implements ICommand {
    name: string;
    desc: string;
    parent: IGroupConstructor;
    argv: any[];
    arguments: any;
    options: any;
    definition: IArgumentsDefinition;
    input: IInput;
    out: IOutput;
    log: ILog;
    cli: Cli<ICommandsDefinition, IParsedCommandsDefinition, ICommandsDefinitionParser>;
    parsed: IParsedArgumentsDefinition;
    private definitionParserFactory;
    helpers: {
        [name: string]: ICommandHelper;
    };
    constructor();
    protected parse(): void;
    hasArg(n: any): boolean;
    arg(n: any): any;
    hasOpt(n: any): boolean;
    opt(n: any): any;
    showHelp(): void;
    setArguments(args: {
        [name: string]: {};
    }): void;
    setOptions(options: {
        [name: string]: {};
    }): void;
    line(text: string): void;
    table(options: any): void;
    progress(): void;
    title(): void;
    addHelper(name: string, helper: ICommandHelper): void;
    getHelper(name: string): ICommandHelper;
}
export default Command;
