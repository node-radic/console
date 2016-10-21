import * as BB from "bluebird";
import { injectable } from "inversify";
import * as inquirer from "inquirer";
import * as    _ from "lodash";


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
        type?: string;
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
    // askInput(question: string, def?: string, opts?: any): Promise<string>
    // askInput(question: string, def?: string): Promise<string>
    ask(question: string, opts?: any)
    // askInput(question: string): Promise<string>
}

@injectable()
export class Input implements IInput {
    noInteraction: boolean = false

    ask(message: string, opts: any = {}): Promise<any> {
        let defer                       = BB.defer();
        let defaults: inquirer.Question = { type: 'input', message: message, name: 'question' }
        inquirer.prompt([
            _.merge(defaults, opts)
        ])[ 'then' ]((answers: any) => {
            defer.resolve(answers.question);
        })
        return <any> defer.promise
    }


    askArgs(questions: {[name: string]: Question}, argv: any) : Promise<Answers> {
        var defer = BB.defer();
        let names = Object.keys(questions)
        if ( argv.noInteraction ) {
            defer.resolve(_.pick(argv, names)); //['name', 'remote', 'method', 'key', 'secret', 'extra']))
            return <any> defer.promise;
        }

        let pm = (name: string, opts: any) => _.merge({
            name: name,
            // 'default': defaults && defaults[ name ] ? defaults[ name ] : null,
            when: (answers: any) => ! argv._[name]
        }, opts)

        let prompts: any[] = names.map((name: string) => {
            return pm(name, questions[ name ])
        })

        return this.prompt(prompts).then((args: any) => {
            args = _.chain(argv)
                .pick(names)
                .merge(args)
                .value();

            defer.resolve(args);
            return defer.promise
        })
    }

    prompt(prompts:Questions) : Promise<Answers>{
        return <any> inquirer.prompt(prompts)
    }


}
export default Input
