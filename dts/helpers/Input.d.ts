import * as inquirer from "inquirer";
import { ChoiceType, Question } from "inquirer";
import { Config } from "../core/config";
import { CliExecuteCommandParseEvent } from "../core/events";
import { HelperOptionsConfig } from "../interfaces";
export interface CheckListItem extends inquirer.objects.ChoiceOption {
    name?: string;
    disabled?: string;
    checked: boolean;
    value?: string;
}
export declare class InputHelper {
    protected _config: Config;
    config: HelperOptionsConfig;
    onExecuteCommandParse(event: CliExecuteCommandParseEvent): void;
    ask(message: string, def?: string): Promise<string>;
    checkbox(msg: any, choices: ChoiceType[] | Array<inquirer.objects.ChoiceOption>, validate?: (answer) => boolean): Promise<string>;
    list(msg: any, choices: ChoiceType[] | Array<inquirer.objects.ChoiceOption>, validate?: (answer) => boolean): Promise<string>;
    multiple(message: string, type: string, choices: ChoiceType[] | Array<inquirer.objects.ChoiceOption>, validate?: (answer) => boolean): Promise<string>;
    confirm(message: string, def?: string): Promise<boolean>;
    password(message: string, def?: string): Promise<string>;
    prompts(questions: inquirer.Questions): Promise<inquirer.Answers>;
    prompt<T extends any>(question: inquirer.Question): Promise<T>;
    interact(message: string, type?: string, opts?: Question, def?: string): Promise<string>;
}
