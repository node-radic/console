import { CliExecuteCommandParsedEvent, CliExecuteCommandParseEvent } from "../../";
import { Output } from "./Output";
import { OutputHelperOptionsConfig } from "./interfaces";
export declare class OutputHelper extends Output {
    config: OutputHelperOptionsConfig;
    output: Output;
    styles(styles: any): void;
    onExecuteCommandParse(event: CliExecuteCommandParseEvent): void;
    onExecuteCommandParsed(event: CliExecuteCommandParsedEvent): void;
}
