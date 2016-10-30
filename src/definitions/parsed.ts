import { Config, defined } from "@radic/util";
import { injectable } from "../core";
import { IOptionsDefinition, IArgumentsDefinition, ICommandsDefinition } from "./definitions";
import { IParsedArgv } from "./argv";
import { Command, Group } from "../commands";
import { IResolvedRegistration } from "../commands/factory";
import { ICommandConstructor } from "../commands/command";
import { IGroupConstructor } from "../commands/group";


export interface IParsedOptions {
    argv: any[]
    definition: IOptionsDefinition
    args: IParsedArgv

    options: {[name: string]: any}
    errors: string[]

    nopts: number

    hasOpt(n: string): boolean
    opt(n: string): any

    hasErrors(): boolean

    help: {enabled: boolean, show: boolean, key: string}

    global?: IParsedOptions
}
export interface IParsedArguments extends IParsedOptions {
    definition: IArgumentsDefinition
    arguments: {[name: string]: any}
    nargs: number
    hasArg(n: string): boolean
    arg(n: string): any
}
export interface IParsedCommands extends IParsedOptions {
    definition: ICommandsDefinition
    isCommand: boolean
    isGroup: boolean
    isRoot: boolean
    command: Command
    group: Group
}

@injectable()
export class ParsedOptionsDefinition implements IParsedOptions {
    help: {enabled: boolean; show: boolean; key: string} = { enabled: false, show: false, key: undefined }
    options: {[name: string]: any}                       = {};
    argv: any[]
    errors: string[]                                     = [];

    definition: IOptionsDefinition
    args: IParsedArgv

    hasOpt(n: string): boolean {
        return ! this.options[ n ] === false
    }

    /** The number of options given */
    get nopts(): number {
        return Object.keys(this.options).length
    }

    opt(n: string): any {
        if ( false === this.hasOpt(n) ) return false;
        return this.options[ n ];
    }

    hasErrors(): boolean {
        return this.errors.length > 0;
    }
}

@injectable()
export class ParsedArgumentsDefinition extends ParsedOptionsDefinition implements IParsedArguments {
    definition: IArgumentsDefinition
    arguments: {[name: string]: any} = {};

    /** The number of arguments given */
    get nargs(): number {
        return Object.keys(this.arguments).length
    }


    hasArg(n: string): boolean {
        return ! this.arguments[ n ] === false;
    }

    arg(n: string): any {
        return this.hasArg(n) ? this.arguments[ n ] : this.definition.getArguments()[n].default
    }
}

@injectable()
export class ParsedCommandsDefinition extends ParsedOptionsDefinition implements IParsedCommands {
    definition: ICommandsDefinition
    isRoot: boolean    = false;
    isCommand: boolean = false
    isGroup: boolean   = false
    command: Command
    group: Group

}
