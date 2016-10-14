import * as Promise from "bluebird";
import { inject, injectable } from "inversify";
import { BINDINGS, ILog } from "../core";
import { IArgumentsDefinitionParser, ICommandsDefinition, ICommandsDefinitionParser, IParsedCommandsDefinition, IParsedArgv, IArgumentsDefinition, IParsedArgumentsDefinition } from "../definitions";
import { IInput, IOutput } from "../io";
import { Cli } from "../core/cli";
import { IGroupConstructor } from "./group";


export interface ICommandHelper
{
    name: string
}

export interface ICommand
{
    name: string
    desc: string
    arguments: any
    options: any
    parsed: IParsedArgumentsDefinition
}

export interface ICommandConstructor
{
    new (): ICommand
}


@injectable()
export class Command implements ICommand
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

    private defer: Promise.Resolver<any>;
    protected asyncMode: boolean = false;


    constructor() {
    }

    fire() {
        this.defer = Promise.defer();
        this.parse();
        // let handle = this.handler || this['handle'];
        this[ 'handle' ].apply(this);
        if ( false === this.asyncMode ) {
            this.done();
        }
        return this.defer.promise;
    }

    private parse() {
        this.parsed = this.definitionParserFactory(this.definition, this.argv).parse();
    }

    protected async() {
        this.asyncMode = true;
        return this.done;
    }

    protected done() { this.defer.resolve(this); }

    protected fail(reason?: string) { this.defer.reject(reason); }

    // parser

    hasArg(n) { return this.parsed.hasArg(n) }

    arg(n) { return this.parsed.arg(n) }

    hasOpt(n) { return this.parsed.hasOpt(n) }

    opt(n) { return this.parsed.opt(n)}


    // definition

    showHelp() { this.definition.showHelp() }

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
