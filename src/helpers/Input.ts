import { inject } from "../Container";
import { helper } from "../decorators";
import * as inquirer from "inquirer";

@helper('input', {
    config: {
        testMe: true
    }
})
export class Input {

    constructor(@inject('console.config') protected config) {}

    ask(question: string, def?: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.prompt(<any> [ { name: 'ask', default: def, type: 'input', message: question } ])
                .catch((reason: any) => reject(reason))
                .then((answers: any) => resolve(answers.ask))
        })
    }

    prompts(questions: inquirer.Questions): Promise<inquirer.Answers> {
        return inquirer.prompt(questions);
    }

    prompt(questions: inquirer.Question): Promise<string|any> {
        return inquirer.prompt(questions);
    }


}