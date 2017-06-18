import { CliExecuteCommandInvalidArgumentsEvent, HaltEvent } from "../core/events";
import { CommandConfig, OptionConfig } from "../interfaces";

export class HelpHelperOnInvalidArgumentsShowHelpEvent extends HaltEvent {
    constructor(public parentEvent: CliExecuteCommandInvalidArgumentsEvent) {
        super('helper:help:on-invalid-arguments:show-help')
    }
}
export class HelpHelperShowHelpEvent extends HaltEvent {
    constructor(public config: CommandConfig, public options: OptionConfig[]) {
        super('helper:help:show-help')
    }
}

