import { CliExecuteCommandParsedEvent, CliExecuteCommandParseEvent, OutputHelperOptionsConfig } from "radical-console";
import { Output } from "./Output";
export declare class OutputHelper extends Output {
    config: OutputHelperOptionsConfig;
    output: Output;
    styles(styles: any): void;
    onExecuteCommandParse(event: CliExecuteCommandParseEvent): void;
    onExecuteCommandParsed(event: CliExecuteCommandParsedEvent): void;
}
