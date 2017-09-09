import inquirer = require('inquirer')
import { Answers } from "inquirer";

declare module "inquirer" {


        /**
         * @link https://github.com/sboudrias/Inquirer.js#list---type-list
         * @link https://github.com/mokkabonna/inquirer-autocomplete-prompt
         * @link https://github.com/DerekTBrown/inquirer-datepicker-prompt
         */
        export type QuestionType = string | 'input' | 'confirm' | 'list' | 'rawlist' | 'expand' | 'checkbox' | 'password' | 'autocomplete' | 'datetime';
        export type MessageType = string | ((answers: Answers) => string)
        export type SourceType = <T>(answersSoFar: Dictionary<string>, input: string) => Promise<T>
        export type DateType = { min?: string, max?: string }
        export type TimeType = { min?: string, max?: string, seconds?: { interval: number }, minutes?: { interval: number }, hours?: { interval: number } }

        interface Question {
            message?: MessageType
            type?: QuestionType
            /** @link https://github.com/mokkabonna/inquirer-autocomplete-prompt */
            source?: SourceType
            /** @link https://github.com/mokkabonna/inquirer-autocomplete-prompt */
            suggestOnly?: boolean

            /**
             * @link https://github.com/DerekTBrown/inquirer-datepicker-prompt
             * @link https://www.npmjs.com/package/dateformat
             */
            format?: string[]

            /**
             * @link https://github.com/DerekTBrown/inquirer-datepicker-prompt
             */
            date?: DateType

            /**
             * @link https://github.com/DerekTBrown/inquirer-datepicker-prompt
             */
            time?: TimeType
        }
}