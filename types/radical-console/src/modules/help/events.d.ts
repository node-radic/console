import { CancelExitEvent, CliExecuteCommandInvalidArgumentsEvent, ExitEvent } from '../../core/events';
import { CommandConfig, OptionConfig } from '../../interfaces';
export declare class HelpHelperOnInvalidArgumentsShowHelpEvent extends CancelExitEvent {
    parentEvent: CliExecuteCommandInvalidArgumentsEvent;
    constructor(parentEvent: CliExecuteCommandInvalidArgumentsEvent);
}
export declare class HelpHelperShowHelpEvent extends ExitEvent {
    config: CommandConfig;
    options: OptionConfig[];
    constructor(config: CommandConfig, options: OptionConfig[]);
}
