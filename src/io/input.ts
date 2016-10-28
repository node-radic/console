import * as BB from "bluebird";
import { injectable } from "inversify";
import * as inquirer from "inquirer";
import * as    _ from "lodash";
import { IParsedArguments } from "../definitions/parsed";

export type QuestionType = "input" |'confirm'|'list'|'rawlist'|'expand'|'checkbox'|'password'|'editor'
export type Questions = Question | Question[] | Rx.Observable<Question>;

/**
 * A key/value hash containing the client answers in each prompt.
 */
export interface Answers {
    [key: string]: string | boolean;
}


export interface Question {
    /**
     * Type of the prompt.
     * Possible values:
     * <ul>
     *      <li>input</li>
     *      <li>confirm</li>
     *      <li>list</li>
     *      <li>rawlist</li>
     *      <li>password</li>
     * </ul>
     * @defaults: 'input'
     */
        type?: QuestionType;
    /**
     * The name to use when storing the answer in the anwers hash.
     */
    name?: string;
    /**
     * The question to print. If defined as a function,
     * the first parameter will be the current inquirer session answers.
     */
    message?: string | ((answers: Answers) => string);
    /**
     * Default value(s) to use if nothing is entered, or a function that returns the default value(s).
     * If defined as a function, the first parameter will be the current inquirer session answers.
     */
    default?: any | ((answers: Answers) => any);
    /**
     * Choices array or a function returning a choices array. If defined as a function,
     * the first parameter will be the current inquirer session answers.
     * Array values can be simple strings, or objects containing a name (to display) and a value properties
     * (to save in the answers hash). Values can also be a Separator.
     */
    choices?: string[] | ((answers: Answers) => string[]);
    /**
     * Receive the user input and should return true if the value is valid, and an error message (String)
     * otherwise. If false is returned, a default error message is provided.
     */
    validate?(input: string): boolean | string;
    /**
     * Receive the user input and return the filtered value to be used inside the program.
     * The value returned will be added to the Answers hash.
     */
    filter?(input: string): string;
    /**
     * Receive the current user answers hash and should return true or false depending on whether or
     * not this question should be asked. The value can also be a simple boolean.
     */
    when?: boolean | ((answers: Answers) => boolean);
    paginated?: boolean;
}

export interface IInput {
    ask(question: string, opts?: any)
    prompt(prompts: Questions): Promise<Answers>
    askSecret(msg: string, opts?: any ): Promise<string>
    confirm(msg:string, def?:boolean, opts?: any ) : Promise<boolean>
    askChoice(msg:string, choices:any[], multi?:boolean, opts?: any ) : Promise<string[]|string>
    askArgs(parsed: IParsedArguments,  questions: {[name: string]: Question}): Promise<Answers>;
}

@injectable()
export class Input implements IInput {
    noInteraction: boolean = false

    ask<R>(message: string, opts: any = {}): Promise<R> {
        let defer              = BB.defer<R>();
        let defaults: Question = { type: 'input', message: message, name: 'question' }
        this.prompt(_.merge(defaults, opts)).then((answers: any) => {
            defer.resolve(answers.question);
        })
        return <any> defer.promise
    }

    askSecret(msg: string, opts: any = {}): Promise<string> {
        return this.ask<string>(msg, _.merge({}, opts))
    }

    confirm(msg:string, def:boolean=true, opts: any = {}) : Promise<boolean> {
        return this.ask<boolean>(msg, _.merge({ default: def }, opts))
    }

    askChoice(msg:string, choices:any[], multi:boolean=false, opts: any = {}) : Promise<string[]|string> {
        return this.ask<string[]|string>(msg, _.merge({ type: multi ? 'checkbox' : 'list', choices }, opts))
    }

    prompt(prompts: Questions): Promise<Answers> {
        return (<any> inquirer.prompt(prompts)).catch(console.error.bind(console))
    }

    askArgs(parsed:IParsedArguments, questions: {[name: string]: Question}) {
        let args: any = _.clone(parsed.arguments)
        var defer     = BB.defer();
        let names     = Object.keys(questions)

        if ( this.noInteraction ) {
            defer.resolve(_.pick(args, names)); //['name', 'remote', 'method', 'key', 'secret', 'extra']))
            return defer.promise;
        }

        let pm = (name: string, opts: any) => _.merge({ name, type: 'input', when: (answers: any) => parsed.hasArg(name) === false }, opts)

        let prompts: any[] = names.map((name: string) => {
            return pm(name, questions[ name ])
        })

        return (<any> inquirer.prompt(prompts))
            .catch(console.error.bind(console))
            .then((answers: any) => {
                answers = _.chain(args)
                    .pick(names)
                    .merge(answers)
                    .value();

                defer.resolve(answers);
                return defer.promise
            })
    }


}
export default Input
