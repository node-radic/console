import * as inquirer from "inquirer";
import * as _ from "lodash";
import * as BB from "bluebird";
import { inject, injectable, BINDINGS, kernel, IHelper, IHelpers } from "../core";
import { IOptionsDefinition, IArgumentsDefinition, IParsedArguments, IArgumentDefinition, IOption } from "../definitions";
import { IGroupConstructor } from "./group";
import { BaseCommandRegistration, ICommandRegistration } from "./factory";
import { Question, Answers } from "../io/input";

export interface ICommandHelper extends IHelper {
    setCommand(command: Command)
}
export interface ICommandHelperConstructor {
    new(): ICommandHelper
}

export interface ICommand extends ICommandRegistration<ICommand> {
    arguments: {[name: string]: IArgumentDefinition}|string[]
    options: {[name: string]: IOption}|string[]
    parsed: IParsedArguments
    definition: IArgumentsDefinition
    globalDefinition: IOptionsDefinition
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
    prettyName: string
    argv: any[] = []

    // can be filled by overriding class
    arguments: {[name: string]: IArgumentDefinition}|string[] = {}
    options: {[name: string]: IOption}|string[]               = {}
    example: string
    usage: string

    parsed: IParsedArguments

    @inject(BINDINGS.ARGUMENTS_DEFINITION)
    definition: IArgumentsDefinition; // filled by createCommand

    @inject(BINDINGS.GLOBAL_DEFINITION)
    globalDefinition: IOptionsDefinition

    @inject(BINDINGS.HELPERS)
    protected helpers: IHelpers<ICommandHelper>

    protected defaultHelpers: string[] = [ 'interaction' ]

    constructor() {
        super()
    }

    protected parse() {
        // merge into an empty definition to generate the parsed definition containing both
        this.parsed = kernel.get<IArgumentsDefinition>(BINDINGS.ARGUMENTS_DEFINITION)
            .mergeOptions(this.definition)
            .mergeOptions(this.globalDefinition)
            .parse(this.argv)

        // handle help before parse errors. the command execution will be canceled anyway when showing help.
        this.handleHelp()

        // handle errors
        if ( this.parsed.hasErrors() ) {
            this.handleParseErrors();
        }

        // add the default helpers
        this.handleDefaultHelpers()
    }

    protected handleHelp() {
        if ( this.parsed.help.enabled && this.parsed.help.show ) {
            this.showHelp()
            this.cli.exit();
        }
    }

    showHelp(title?: string, desc?: string) {
        this.out
            .title(title || this.prettyName)
            .description(desc || this.desc)

        this.descriptor.command(this);
    }

    protected handleParseErrors() {
        let len  = this.parsed.errors.length;
        let text = len === 1 ? '1 error:' : len + ' errors:'
        this.out.subtitle('The command failed because of ' + text)
        this.parsed.errors.forEach((err: string, i: number) => {
            this.log.error(err)
        })
        this.fail()
        this.cli.exit()
    }

    protected handleDefaultHelpers() {
        this.defaultHelpers.forEach((name: string) => {
            let cls: ICommandHelperConstructor = require('./helpers/' + name).default
            this.addHelper(cls);
        })
        // reset it. calling this function again will then do nothing
        this.defaultHelpers = []
    }

    // parser

    hasArg(n) { return this.parsed.hasArg(n) }

    askArg(name: string, opts: any = {}) {
        let defer = BB.defer();

        if ( this.hasArg(name) )
            defer.resolve(this.arg(name));
        else
            this.in.ask(name + '?', opts)
                .then((answer: string) => defer.resolve(answer))


        return defer.promise;
    }

    askArgs(questions: {[name: string]: Question}): Promise<Answers> {
        return this.in.askArgs(this.parsed, questions)
    }


    arg(n) { return this.parsed.arg(n) }

    hasOpt(n) { return this.parsed.hasOpt(n) }

    opt(n) { return this.parsed.opt(n)}


    // definition
    setArguments(args: {[name: string]: {}}) { this.definition.arguments(args); }

    setOptions(options: {[name: string]: {}}) { this.definition.options(options); }


    // io
    line(text: string) { this.out.writeln(text) }

    table(options) { }

    progress() {}

    title() {}


    // etc


    addHelper(cls: ICommandHelperConstructor) {
        let helper: ICommandHelper = kernel.build<ICommandHelper>(cls);
        helper.setCommand(this);
        this.log.debug('Adding helper ' + helper.getName(), helper)
        this.helpers.set(helper.getName(), helper);
        return this;
    }

    getHelper<T extends ICommandHelper>(name: string): T { return <T> this.helpers.get(name) }

}
export default Command
