import * as Promise from "bluebird";
import { inject, injectable } from "inversify";
import { BINDINGS, ILog } from "../core";
import { IArgumentsDefinitionParser, ICommandsDefinition, ICommandsDefinitionParser, IParsedCommandsDefinition, IParsedArgv, IArgumentsDefinition, IParsedArgumentsDefinition } from "../definitions";
import { IInput, IOutput } from "../io";
import { Cli } from "../core/cli";
import { IGroupConstructor } from "./group";
import { BaseCommandRegistration, ICommandRegistration } from "./factory";


export interface ICommandHelper
{
    name: string
}

export interface ICommand extends ICommandRegistration<ICommand> {
    arguments: any
    options: any
    parsed: IParsedArgumentsDefinition
}

export interface ICommandConstructor
{
    new (): ICommand
}


@injectable()
export class Command extends BaseCommandRegistration implements ICommand
{
    // filled by createCommand
    name: string;
    desc: string;
    parent: IGroupConstructor;
    argv: any[] = []

    // can be filled by overriding class
    arguments: any = {}
    options: any   = {}

    @inject(BINDINGS.ARGUMENTS_DEFINITION)
    public definition: IArgumentsDefinition; // filled by createCommand

    @inject(BINDINGS.INPUT)
    public input: IInput;

    @inject(BINDINGS.OUTPUT)
    public out: IOutput;

    @inject(BINDINGS.LOG)
    public log: ILog;

    @inject(BINDINGS.CLI)
    public cli: Cli<ICommandsDefinition, IParsedCommandsDefinition, ICommandsDefinitionParser>

    parsed: IParsedArgumentsDefinition

    @inject(BINDINGS.OPTIONS_DEFINITION_PARSER_FACTORY)
    private definitionParserFactory: (definition: IArgumentsDefinition, args: IParsedArgv) => IArgumentsDefinitionParser

    helpers: {[name: string]: ICommandHelper}


    constructor() {
        super()
    }

    protected parse() {
        this.parsed = this.definitionParserFactory(this.definition, this.argv).parse();
    }

    // parser

    hasArg(n) { return this.parsed.hasArg(n) }

    arg(n) { return this.parsed.arg(n) }

    hasOpt(n) { return this.parsed.hasOpt(n) }

    opt(n) { return this.parsed.opt(n)}


    // definition

    showHelp() {

    }

    setArguments(args: {[name: string]: {}}) { this.definition.arguments(args); }

    setOptions(options: {[name: string]: {}}) { this.definition.options(options); }


    // io
    line(text: string) { this.out.writeln(text) }

    table(options) { }

    progress() {}

    title() {}


    // etc


    addHelper(name: string, helper: ICommandHelper) { this.helpers[ name ] = helper; }

    getHelper(name: string) { return this.helpers[ name ] }

}
export default Command
