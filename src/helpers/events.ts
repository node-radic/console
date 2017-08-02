import { CancelExitEvent, CliExecuteCommandInvalidArgumentsEvent, ExitEvent } from "../core/events";
import { CommandConfig, OptionConfig } from "../interfaces";

export class HelpHelperOnInvalidArgumentsShowHelpEvent extends CancelExitEvent {
    constructor(public parentEvent: CliExecuteCommandInvalidArgumentsEvent) {
        super('helper:help:on-invalid-arguments:show-help')
    }
}
export class HelpHelperShowHelpEvent extends ExitEvent {
    constructor(public config: CommandConfig, public options: OptionConfig[]) {
        super('helper:help:show-help')
    }
}

