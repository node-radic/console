import * as inquirer from "inquirer";
import * as _ from "lodash";
import * as BB from "bluebird";
import { kindOf } from "@radic/util";
import { inject, injectable, BINDINGS } from "../core";
import { IOptionsDefinition, IArgumentsDefinition, IParsedArguments } from "../definitions";
import { IGroupConstructor } from "./group";
import { BaseCommandRegistration, ICommandRegistration } from "./factory";
import { IHelper, IHelpers } from "../core/helpers";


export interface ICommandHelper extends IHelper {

}

export interface ICommand extends ICommandRegistration<ICommand> {
    arguments: any
    options: any
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
    arguments: any = {}
    options: any   = {}
    example: string
    usage: string

    parsed: IParsedArguments

    @inject(BINDINGS.ARGUMENTS_DEFINITION)
    definition: IArgumentsDefinition; // filled by createCommand

    @inject(BINDINGS.GLOBAL_DEFINITION)
    globalDefinition: IOptionsDefinition

    @inject(BINDINGS.HELPERS)
    helpers: IHelpers<ICommandHelper>


    constructor() {
        super()
    }

    protected parse() {
        // merge into an empty definition
        this.parsed = _.clone(this.definition).mergeOptions(this.globalDefinition).parse(this.argv);
        // this.parsed.global = this.definition.parse(this.argv);

        this.handleHelp()

        // handle errors
        if ( this.parsed.hasErrors() ) {
            this.handleParseErrors();
        }

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
            .line()
            .line(desc || this.desc)

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

    askArgs(questions: {[name: string]: inquirer.Question}, argv: any) {
        var defer = BB.defer();
        let names = Object.keys(questions)
        if ( argv.noInteraction ) {
            defer.resolve(_.pick(argv, names)); //['name', 'remote', 'method', 'key', 'secret', 'extra']))
            return defer.promise;
        }

        let pm = (name: string, opts: any) => _.merge({
            name: name,
            // 'default': defaults && defaults[ name ] ? defaults[ name ] : null,
            when: (answers: any) => this.hasArg(name) === false
        }, opts)

        let prompts: any[] = names.map((name: string) => {
            return pm(name, questions[ name ])
        })

        return (<any> inquirer.prompt(prompts)).then((args: any) => {
            args = _.chain(argv)
                .pick(names)
                .merge(args)
                .value();

            defer.resolve(args);
            return defer.promise
        })


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


    addHelper(name: string, helper: ICommandHelper) { this.helpers[ name ] = helper; }

    getHelper(name: string) { return this.helpers[ name ] }

}
export default Command
