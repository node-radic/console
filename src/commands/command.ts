import * as Promise from 'bluebird';
import { inject, injectable, BINDINGS } from "../core";
import { IArgumentsDefinitionParser, IOptionsDefinition , IOptionsDefinitionParser, IParsedArgv, IArgumentsDefinition, IParsedArgumentsDefinition } from "../definitions";
import { IInput } from "../io";
import { IGroupConstructor } from "./group";
import { BaseCommandRegistration, ICommandRegistration } from "./factory";


export interface ICommandHelper {
    name: string
}

export interface ICommand extends ICommandRegistration<ICommand> {
    arguments: any
    options: any
    parsed: IParsedArgumentsDefinition
}

export interface ICommandConstructor {
    new (): ICommand
}


@injectable()
export class Command extends BaseCommandRegistration implements ICommand {
    // filled by createCommand
    name: string;
    desc: string;
    parent: IGroupConstructor;
    argv: any[] = []

    // can be filled by overriding class
    arguments: any = {}
    options: any   = {}

    parsed: IParsedArgumentsDefinition

    @inject(BINDINGS.INPUT)
    input: IInput;

    @inject(BINDINGS.ARGUMENTS_DEFINITION)
    definition: IArgumentsDefinition; // filled by createCommand

    @inject(BINDINGS.ARGUMENTS_DEFINITION_PARSER_FACTORY)
    protected definitionParserFactory: (definition: IArgumentsDefinition, args: IParsedArgv) => IArgumentsDefinitionParser

    @inject(BINDINGS.GLOBAL_DEFINITION)
    globalDefinition: IOptionsDefinition

    @inject(BINDINGS.OPTIONS_DEFINITION_PARSER_FACTORY)
    protected globalDefinitionParserFactory: (definition: IOptionsDefinition, args: IParsedArgv) => IOptionsDefinitionParser


    helpers: {[name: string]: ICommandHelper}


    constructor() {
        super()
    }

    protected parse() {
        this.parsed = this.definitionParserFactory(this.definition, this.argv).parse();

        this.parsed.global = this.globalDefinitionParserFactory(this.globalDefinition, this.argv).parse();

        // handle errors
        if ( this.parsed.hasErrors() ) {
            let len  = this.parsed.errors.length;
            let text = len === 1 ? '1 error:' : len + ' errors:'
            this.out.subtitle('The command failed because of ' + text)
            this.parsed.errors.forEach((err: string, i: number) => {
                this.log.error(err)
            })
        }
    }

    // parser

    hasArg(n) { return this.parsed.hasArg(n) }

    getOrAskArg(name:string, type:string, ){
        // Promise.
        if(this.hasArg(name)) return this.arg;
        // return this.input.ask(name + '?').catch((reason) => this.fail(reason))
    }

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
