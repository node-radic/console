import { HelperOptionsConfig } from "../interfaces";
import { LoggerInstance } from "winston";
import { CliExecuteCommandParsedEvent, CliExecuteCommandParseEvent } from "../core/events";
export declare class VerbosityHelper {
    config: HelperOptionsConfig;
    log: LoggerInstance;
    onExecuteCommandParse(event: CliExecuteCommandParseEvent): void;
    onExecuteCommandParsed(event: CliExecuteCommandParsedEvent): void;
}
