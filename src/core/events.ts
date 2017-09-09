import { Cli } from "./Cli";
import { container, injectable } from "./Container";
import { CommandConfig, Dictionary, HelperOptions, HelperOptionsConfig, OptionConfig, ParsedCommandArguments } from "../interfaces";
import { YargsParserArgv } from "yargs-parser";
import { ChildProcess } from "child_process";
import { Helpers } from "./Helpers";

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

    public stopIfExit(): this {
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

    public cancel() {
        this._canceled = true;
    }

    public canceled<T>(cb: (event?: this) => T): T | this {
        if ( this._canceled === true ) {
            return cb(this);
        }
        return this;
    }

    public proceed(cb: () => void): this {
        if ( this._canceled === false ) {
            cb();
        }
        return this;
    }

    public isCanceled(): boolean { return this._canceled }
}

@injectable()
export abstract class CancelExitEvent extends ExitEvent {
    private _canceled: boolean = false;

    protected cancel() {
        this._canceled = true;
    }

    public canceled(cb: () => void): this {
        if ( this._canceled === true ) {
            cb();
        }
        return this;
    }

    public proceed(cb: () => void): this {
        if ( this._canceled === false ) {
            cb();
        }
        return this;
    }

    public isCanceled(): boolean { return this._canceled }
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


/**
 * Fires when a helper is getting started but a dependency is missing.
 *
 * If `options.enableDepends === false` then a `HelperDependencyMissingError` will be thrown.
 * This can be countered by canceling, which will make it so that the depended helper will **NOT** start, but the program  **WILL** continue.
 *
 * Refer to the `Helpers.startHelper()` method if you want to know more.
 */
export class HelperDependencyMissingEvent extends CancelEvent {
    constructor(public helperName:string, public dependencyName:string, public helperOptions:HelperOptions){
        super('helper:starting:dependency:missing')
    }
}

/**
 * Fires when a helper class is resolved from the container.
 * This is actually Inversify's binding onActivation being used, which is responsible for setting the configuration on the helper instance.
 * This event is fired AFTER the configuration has been set on the helper instance
 *
 * It is possible to listen to all helpers triggering this event using the event wildcard:
 * `helper:resolved:*`
 *
 * It is also possible to listen for a specific helper triggering this event:
 * `helper:resolved:<name>`
 * For example, the verbose helper:
 * `helper:resolved:verbose`
 */
export class HelperContainerResolvedEvent<T=any> extends Event {
    constructor(public helper:T, public options:HelperOptions){
        super('helper:resolved:' + options.name)
    }
}