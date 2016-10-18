import * as BB from "bluebird";
import { injectable } from "inversify";
import * as inquirer from "inquirer";
import * as    _ from "lodash";
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

}
export default Input
