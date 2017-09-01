import { helper } from "../";
import * as inquirer from "inquirer";
import { ChoiceType, Question,MessageType,QuestionType, SourceType,DateType,TimeType } from "inquirer";
import { inject } from "../core/Container";
import { Config } from "../core/config";
import * as _ from "lodash";
import { kindOf } from "@radic/util";
import { CliExecuteCommandParseEvent } from "../core/events";
import { HelperOptionsConfig, InputHelperOptionsConfig } from "../interfaces";
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

    public get types(): QuestionType[] { return [ 'input', 'confirm', 'list', 'rawlist', 'expand', 'checkbox', 'password', 'autocomplete', 'datetime' ] }

    config: InputHelperOptionsConfig

    public onExecuteCommandParse(event: CliExecuteCommandParseEvent) {
        let promptNames = Object.keys(inquirer.prompts);
        if ( ! promptNames.includes('autocomplete') ) inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'))
        if ( ! promptNames.includes('datetime') ) inquirer.registerPrompt('datetime', require('inquirer-datepicker-prompt'))

        if ( kindOf(this.config.registerPrompts) === 'function' ) {
            this.config.registerPrompts(inquirer)
        }
    }

    async ask(message: MessageType, def?: string): Promise<string> {
        return this.prompt<string>({ default: def, type: 'input', message })
    }


    async confirm(message: MessageType, def?: string): Promise<boolean> {
        return this.prompt<boolean>({ type: 'confirm', default: def, message })
    }

    async list(msg:MessageType, choices: ChoiceType[] | Array<inquirer.objects.ChoiceOption>, validate?: (answer) => boolean): Promise<string> {
        return this.multiple(msg, 'list', choices, validate);
    }

    async rawlist(msg:MessageType, choices: ChoiceType[] | Array<inquirer.objects.ChoiceOption>, validate?: (answer) => boolean): Promise<string> {
        return this.multiple(msg, 'rawlist', choices, validate);
    }

    async expand(msg:MessageType, choices: ChoiceType[] | Array<inquirer.objects.ChoiceOption>, validate?: (answer) => boolean): Promise<string> {
        return this.multiple(msg, 'expand', choices, validate);
    }

    async checkbox(msg:MessageType, choices: ChoiceType[] | Array<inquirer.objects.ChoiceOption>, validate?: (answer) => boolean): Promise<string> {
        return this.multiple(msg, 'checkbox', choices, validate);
    }

    async password(message: MessageType, def?: string, validate?: (answer) => boolean): Promise<string> {
        return this.prompt<string>({ type: 'password', default: def, message, validate })
    }

    async autocomplete(message:MessageType, source: string[] | SourceType, suggestOnly:boolean=false, validate?: (answer) => boolean): Promise<string> {
        let src:SourceType = <SourceType> source;
        if(kindOf(source) === 'array'){
            src = (answersSoFar, input) : Promise<any>=> {
                return Promise.resolve((<string[]> source).filter((name) => {
                    return name.startsWith(input);
                }))
            }
        }

        return this.prompt<string>({ type: 'autocomplete', message, source: src, suggestOnly, validate })
    }

    /**
     *
     * @link https://github.com/DerekTBrown/inquirer-datepicker-prompt
     * @link https://www.npmjs.com/package/dateformat
     *
     * @returns {Promise<string>}
     */
    async datetime(message:MessageType, date?:DateType, time?:TimeType, format: string[] = ['d', '/', 'm', '/', 'yyyy', ' ', 'HH', ':', 'MM', ':', 'ss']): Promise<string> {
        return this.prompt<string>({ type: 'datetime', message, date, time, format })

    }

    async multiple(message: MessageType, type: QuestionType, choices: ChoiceType[] | Array<inquirer.objects.ChoiceOption>, validate?: (answer) => boolean): Promise<string> {
        let prompt = { type, message, choices }
        if ( validate ) {
            prompt[ 'validate' ] = validate;
        }
        return this.prompt<string>(prompt)
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
