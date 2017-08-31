import { Cli } from "./Cli";
import { container, injectable } from "./Container";
import { BasePluginConfig, CommandConfig, Dictionary, HelperOptionsConfig, OptionConfig, ParsedCommandArguments, Plugin } from "../interfaces";
import { YargsParserArgv } from "yargs-parser";
import { ChildProcess } from "child_process";
import { Helpers } from "./Helpers";
import { Mixin } from "@radic/util";

@injectable()
export abstract class Event {
    public get cli(): Cli {
        return container.get<Cli>('cli');
    }

    constructor(public event: string | string[] = undefined) {}
}

@injectable()
export abstract class ExitEvent extends Event {
    private _exit: boolean    = false;
    private _exitCode: number = 0;

    public exit(code: number = 0) {
        this._exit     = true
        this._exitCode = code;
    }

    public stopIfExit():this {
        if ( this._exit ) {
            process.exit(this._exitCode);
        }
        return this;
    }

    public shouldExit(): boolean { return this._exit; }
}

@injectable()
export abstract class CancelEvent extends Event {
    private _canceled: boolean = false;
    public cancel(){
        this._canceled = true;
    }
    public canceled<T>(cb:(event?:this)=>T) : T | this {
        if(this._canceled === true){
            return cb(this);
        }
        return this;
    }
    public proceed(cb:()=>void) : this  {
        if(this._canceled === false){
            cb();
        }
        return this;
    }
    public isCanceled():boolean { return this._canceled }
}

@injectable()
export abstract class CancelExitEvent extends ExitEvent {
    private _canceled: boolean = false;
    protected cancel(){
        this._canceled = true;
    }
    public canceled(cb:()=>void) : this  {
        if(this._canceled === true){
            cb();
        }
        return this;
    }
    public proceed(cb:()=>void) : this  {
        if(this._canceled === false){
            cb();
        }
        return this;
    }
    public isCanceled():boolean { return this._canceled }
}


export class CliStartEvent extends CancelEvent {
    constructor(public requiredPath: string) {
        super('cli:start')
    }
}

export class CliParseEvent extends CancelExitEvent {
    constructor(public config: CommandConfig, public globals: OptionConfig[], public isRootCommand: boolean) {
        super('cli:parse')
    }
}
export class CliParsedEvent extends ExitEvent {
    constructor(public config: CommandConfig, public globals: OptionConfig[], public isRootCommand: boolean, public argv: YargsParserArgv) {
        super('cli:parsed')
    }
}
export class CliSpawnEvent extends ExitEvent {
    constructor(public args: string[], public file: string, public proc: ChildProcess) {
        super('cli:spawn')
    }
}

export class CliExecuteCommandEvent extends CancelEvent {
    constructor(public config: CommandConfig, public alwaysRun: null | string) {
        super('cli:execute')
    }
}
export class CliExecuteCommandParseEvent extends ExitEvent {
    constructor(public config: CommandConfig, public options: OptionConfig[]) {
        super('cli:execute:parse')
    }
}
export class CliExecuteCommandParsedEvent extends ExitEvent {
    constructor(public argv: YargsParserArgv, public config: CommandConfig, public options: OptionConfig[]) {
        super('cli:execute:parsed')
    }
}
export class CliExecuteCommandInvalidArgumentsEvent<T = any> extends ExitEvent {
    constructor(public instance: T,
                public parsed: ParsedCommandArguments,
                public config: CommandConfig,
                public options: OptionConfig[]) {
        super('cli:execute:invalid')
    }
}
export class CliExecuteCommandHandleEvent<T = any> extends ExitEvent {
    constructor(public instance: T,
                public parsed: ParsedCommandArguments,
                public argv: YargsParserArgv,
                public config: CommandConfig,
                public options: OptionConfig[]) {
        super('cli:execute:handle')
    }
}
export class CliExecuteCommandHandledEvent<T = any> extends ExitEvent {
    constructor(public result: any,
                public instance: T,
                public argv: YargsParserArgv,
                public config: CommandConfig,
                public options: OptionConfig[]) {
        super('cli:execute:handled')
    }
}

export class CliPluginRegisterEvent<T extends BasePluginConfig=BasePluginConfig> extends CancelEvent {
    constructor(public plugin:Plugin<T>,
                public config:T){
        super('cli:plugin:register')
    }
}
export class CliPluginRegisteredEvent<T extends BasePluginConfig=BasePluginConfig> extends Event {
    constructor(public plugin:Plugin<T>){
        super('cli:plugins:registered')
    }
}

export class HelpersStartingEvent extends CancelEvent {
    constructor(public helpers: Helpers, public enabledHelpers: string[]) {
        super('helpers:starting')
    }
}
export class HelperStartingEvent extends CancelEvent {
    constructor(public helpers: Helpers, public name: string) {
        super('helper:starting')
    }
}
export class HelperStartedEvent extends Event {
    constructor(public helpers: Helpers, public name: string) {
        super('helper:started')
    }
}
export class HelpersStartedEvent extends Event {
    constructor(public helpers: Helpers, public startedHelpers: string[]) {
        super('helpers:started')
    }
}