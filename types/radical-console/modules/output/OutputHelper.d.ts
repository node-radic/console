import { CliExecuteCommandParsedEvent, CliExecuteCommandParseEvent } from "radical-console";
import { Output } from "./Output";
import { OutputHelperOptionsConfig } from "@output";
export declare class OutputHelper extends Output {
    config: OutputHelperOptionsConfig;
    output: Output;
    styles(styles: any): void;
    onExecuteCommandParse(event: CliExecuteCommandParseEvent): void;
    onExecuteCommandParsed(event: CliExecuteCommandParsedEvent): void;
}
