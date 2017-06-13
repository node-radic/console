import { Cli } from "./Cli";
import { container } from "./Container";
import { CommandConfig, OptionConfig, ParsedCommandArguments } from "../interfaces";
import { YargsParserArgv } from "../../types/yargs-parser";
import { ChildProcess } from "child_process";

export abstract class Event {
    public get cli(): Cli {
        return container.get<Cli>('cli');
    }

    constructor(public event: string | string[] = undefined) {}
}
export abstract class HaltEvent extends Event {
    public halt: boolean = false;

    public stop() { this.halt = true }
}


export class CliParseEvent extends HaltEvent {
    constructor(public config: CommandConfig, public globals: OptionConfig[]) {
        super('cli:parse')
    }
}
export class CliParsedEvent extends HaltEvent {
    constructor(public config: CommandConfig, public argv: YargsParserArgv, public globals: OptionConfig[]) {
        super('cli:parsed')
    }
}
export class CliSpawnEvent extends HaltEvent {
    constructor(public args: string[], public file: string, public proc: ChildProcess) {
        super('cli:spawn')
    }
}
export class CliExecuteCommandParseEvent extends HaltEvent {
    constructor(public config: CommandConfig, public options: OptionConfig[]) {
        super('cli:execute:parse')
    }
}
export class CliExecuteCommandParsedEvent extends HaltEvent {
    constructor(public argv: YargsParserArgv, public config: CommandConfig, public options: OptionConfig[]) {
        super('cli:execute:parsed')
    }
}
export class CliExecuteCommandInvalidArguments<T = any> extends HaltEvent {
    constructor(public instance: T,
                public parsed: ParsedCommandArguments,
                public config: CommandConfig,
                public options: OptionConfig[]) {
        super('cli:execute:invalid')
    }
}
export class CliExecuteCommandHandleEvent<T = any> extends HaltEvent {
    constructor(public instance: T,
                public parsed: ParsedCommandArguments,
                public argv: YargsParserArgv,
                public config: CommandConfig,
                public options: OptionConfig[]) {
        super('cli:execute:handle')
    }
}
export class CliExecuteCommandHandledEvent<T = any> extends HaltEvent {
    constructor(public result: any,
                public instance: T,
                public argv: YargsParserArgv,
                public config: CommandConfig,
                public options: OptionConfig[]) {
        super('cli:execute:handled')
    }
}