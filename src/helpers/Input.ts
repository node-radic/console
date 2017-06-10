import { helper, inject } from "../";
import * as inquirer from "inquirer";

@helper('input', {
    config: {
        testMe: true
    }
})
export class Input {

    constructor(@inject('cli.config') protected config) {}

    ask(question: string, def?: string): Promise<string> {
        return <Promise<string>> new Promise((resolve, reject) => {
            this.prompt(<any> [ { name: 'ask', default: def, type: 'input', message: question } ])
                .catch((reason: any) => reject(reason))
                .then((answers: any) => resolve(answers.ask))
        })
    }

    confirm(message: string, def?: string): Promise<boolean> {
        return this.prompt({ type: 'confirm', default: def, message })
            .then((answer) => Promise.resolve(<boolean> answer))
    }

    password(message:string, def?:string): Promise<string> {
        return this.prompt<string>({type: 'password', default: def, message}).then(a => Promise.resolve(a))
    }

    prompts(questions: inquirer.Questions): Promise<inquirer.Answers> {
        return inquirer.prompt(questions);
    }

    prompt<T extends any>(question: inquirer.Question): Promise<T> {
        question.name = 'prompt'
        return inquirer.prompt([ question ],).then((answers) => Promise.resolve(<T>answers.prompt));
    }


}