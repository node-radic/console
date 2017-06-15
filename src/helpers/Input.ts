import { helper } from "../";
import * as inquirer from "inquirer";
import { Answers, Question } from "inquirer";
import { lazyInject } from "../core/Container";
import { Config } from "../core/config";
import * as _ from "lodash";
import { kindOf } from "@radic/util";
import ChoiceOption = inquirer.objects.ChoiceOption;

export interface CheckListItem extends ChoiceOption {
    name?: string
    disabled?: string
    checked: boolean
    value?: string
}
const seperator = (msg = '') => new inquirer.Separator(` -=${msg}=- `)

@helper('input', {
    config: {
        testMe: true
    }
})
export class InputHelper {
    @lazyInject('cli.config')
    protected config: Config


    async ask(question: string, def?: string): Promise<string> {
        return <Promise<string>> new Promise((resolve, reject) => {
            inquirer.prompt({ name: 'ask', default: def, type: 'input', message: question })
                .then(answers => resolve(answers.ask))
            //     .catch(err => reject(err));
        });
    }
    async checkbox(msg, choices: Array<ChoiceOption>, validate?: (answer) => boolean) {
        if ( kindOf(choices) === 'array' ) {
            choices.map(name => {
                return {
                    name : name,
                    value: name,
                    type : 'string'
                }
            })
        }
        let prompt = {
            type   : 'checkbox',
            message: msg,
            name   : 'toppings',
            choices: choices,
        }
        if ( validate ) {
            prompt[ 'validate' ] = validate;
        }
        return <Promise<Answers>> new Promise((resolve, reject) => {
            return inquirer.prompt([ prompt ]).then(function (answers) {
                return resolve(<Answers> answers['toppings']);
            }).catch(e => reject(e))
        });
    }

    async list(msg, choices: Array<ChoiceOption>, validate?: (answer) => boolean) {
        return <Promise<string>> new Promise((resolve, reject) => {
            let prompt = {
                type   : 'list',
                message: msg,
                name   : 'ask',
                choices: choices,
            }
            if ( validate ) {
                prompt[ 'validate' ] = validate;
            }
            inquirer.prompt([ prompt ]).then(function (answers) {
                resolve(<string> answers.ask);

            })
        });
    }

    async confirm(message: string, def?: string): Promise<boolean> {
        return this.prompt({ type: 'confirm', default: def, message })
            .then((answer) => Promise.resolve(<boolean> answer))
    }

    async password(message: string, def?: string): Promise<string> {
        return this.prompt<string>({ type: 'password', default: def, message }).then(a => Promise.resolve(a))
    }

    async prompts(questions: inquirer.Questions): Promise<inquirer.Answers> {
        return inquirer.prompt(questions);
    }

    async prompt<T extends any>(question: inquirer.Question): Promise<T> {
        question.name = 'prompt'
        return inquirer.prompt([ question ],).then((answers) => Promise.resolve(<T>answers.prompt));
    }

    async interact(message: string, type: string = 'input', opts: Question = {}, def?: string) {
        return <Promise<string>> new Promise((resolve, reject) => {
            let question = _.merge({ name: 'ask', message, type, default: def }, opts)
            inquirer.prompt(question).then(answers => resolve(answers.ask)).catch(e => reject(e))
        })
    }
}
