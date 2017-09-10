/// <reference types="winston" />
import { VerboseHelperOptionsConfig } from "../../interfaces";
import { LoggerInstance } from "winston";
import { CliExecuteCommandParsedEvent, CliExecuteCommandParseEvent } from "../../core/events";
export declare class VerbosityHelper {
    config: VerboseHelperOptionsConfig;
    log: LoggerInstance;
    onExecuteCommandParse(event: CliExecuteCommandParseEvent): void;
    onExecuteCommandParsed(event: CliExecuteCommandParsedEvent): void;
}
