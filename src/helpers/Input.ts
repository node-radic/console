import { helper } from "../";
import * as inquirer from "inquirer";
import { Answers, ChoiceType, Question } from "inquirer";
import { inject } from "../core/Container";
import { Config } from "../core/config";
import * as _ from "lodash";
import { kindOf } from "@radic/util";
import { CliExecuteCommandParseEvent } from "../core/events";
import { HelperOptionsConfig } from "../interfaces";

export interface CheckListItem extends inquirer.objects.ChoiceOption {
    name?: string
    disabled?: string
    checked: boolean
    value?: string
}
const seperator = (msg = '') => new inquirer.Separator(` -=${msg}=- `)

@helper('input', {
    singleton: true,
    config   : {
        registerPrompts: (inquirer: inquirer.Inquirer) => {}
    },
    listeners: {
        'cli:execute:parse': 'onExecuteCommandParse'
    }
})
export class InputHelper {
    @inject('cli.config')
    protected _config: Config

    config: HelperOptionsConfig

    public onExecuteCommandParse(event: CliExecuteCommandParseEvent) {
        if ( kindOf(this.config.registerPrompts) === 'function' ) {
            this.config.registerPrompts(inquirer)
        }
    }

    async ask(message: string, def?: string): Promise<string> {
        return this.prompt<string>({ default: def, type: 'input', message })
    }

    async checkbox(msg, choices: ChoiceType[] | Array<inquirer.objects.ChoiceOption>, validate?: (answer) => boolean) : Promise<string> {
        return this.multiple(msg, 'checkbox', choices, validate);
    }

    async list(msg, choices: ChoiceType[] | Array<inquirer.objects.ChoiceOption>, validate?: (answer) => boolean) : Promise<string> {
        return this.multiple(msg, 'list', choices, validate);
    }

    async multiple(message: string, type: string, choices: ChoiceType[] | Array<inquirer.objects.ChoiceOption>, validate?: (answer) => boolean) : Promise<string> {
        let prompt = { type, message, choices }
        if ( validate ) {
            prompt[ 'validate' ] = validate;
        }
        return this.prompt<string>(prompt)
    }

    async confirm(message: string, def?: string): Promise<boolean> {
        return this.prompt<boolean>({ type: 'confirm', default: def, message })
    }

    async password(message: string, def?: string): Promise<string> {
        return this.prompt<string>({ type: 'password', default: def, message })
    }

    async prompts(questions: inquirer.Questions): Promise<inquirer.Answers> {
        return inquirer.prompt(questions);
    }

    async prompt<T extends any>(question: inquirer.Question): Promise<T> {
        question.name = 'prompt'
        return inquirer.prompt([ question ])
            .then((answers) => Promise.resolve(<T>answers.prompt))
            .catch(e => Promise.reject(e))
    }

    async interact(message: string, type: string = 'input', opts: Question = {}, def?: string) {
        return <Promise<string>> new Promise((resolve, reject) => {
            let question = _.merge({ name: 'ask', message, type, default: def }, opts)
            inquirer.prompt(question).then(answers => resolve(answers.ask)).catch(e => reject(e))
        })
    }
}
