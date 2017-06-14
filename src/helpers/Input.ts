import { helper } from "../";
import * as inquirer from "inquirer";
import { Answers, Question } from "inquirer";
import { lazyInject } from "../core/Container";
import { Config } from "../core/config";
import * as _ from "lodash";
import ChoiceOption = inquirer.objects.ChoiceOption;

export interface CheckListItem extends ChoiceOption {
    name?: string
    disabled?: string
    checked: boolean
    value?: string
}

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
            // (<any> [ { name: 'ask', default: def, type: 'input', message: question } ])
            //     .catch((reason: any) => reject(reason))
            //     .then((answers: any) => resolve(answers.ask))
        })
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

    async list(message: string, choices: string[] = [], def?: string) {
        return <Promise<string>> new Promise((resolve, reject) => {
            return inquirer.prompt([
                { type: 'list', name: 'ask', message, choices }
            ]).then(function (answers) {
                resolve(answers.ask)
            }).catch(e => reject(e))
        })
    }


    protected checklistSeperator(msg = '') {return new inquirer.Separator(` = ${msg} = `)}

    checkListBuilder(validator?: (answer: string) => boolean) {

        let builder = {
            choices: [],
            add(val: string, name: string, checked: boolean = false, disabled: boolean = false) {
                let opts = { name, value: val };
                if ( checked ) opts[ 'checked' ] = true;
                if ( disabled ) opts[ 'disabled' ] = true;
                builder.choices.push()
                return builder;
            },
            sep(msg: string = ''){
                builder.choices.push(this.checklistSeperator(msg));
                return builder;
            }
        }
        return builder;
    }

    async checkbox(msg, choices: Array<ChoiceOption>, validate?: (answer) => boolean) {
        return <Promise<Answers>> new Promise((resolve, reject) => {
            let prompt = {
                type   : 'checkbox',
                message: msg,
                name   : 'toppings',
                choices: choices,
            }
            if ( validate ) {
                prompt[ 'validate' ] = validate;
            }
            inquirer.prompt([ prompt ]).then(function (answers) {
                resolve(<Answers> answers);

            })
        });
    }
}
