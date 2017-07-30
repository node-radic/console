import { CliExecuteCommandInvalidArgumentsEvent, HaltEvent } from "../core/events";
import { CommandConfig, OptionConfig } from "../interfaces";
export declare class HelpHelperOnInvalidArgumentsShowHelpEvent extends HaltEvent {
    parentEvent: CliExecuteCommandInvalidArgumentsEvent;
    constructor(parentEvent: CliExecuteCommandInvalidArgumentsEvent);
}
export declare class HelpHelperShowHelpEvent extends HaltEvent {
    config: CommandConfig;
    options: OptionConfig[];
    constructor(config: CommandConfig, options: OptionConfig[]);
}
