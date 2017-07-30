import { Parser } from "@radic/console-colors";
import { HelperOptionsConfig, OutputColumnsOptions } from "../interfaces";
import { CliExecuteCommandParsedEvent, CliExecuteCommandParseEvent } from "../core/events";
export declare class OutputHelper {
    config: HelperOptionsConfig;
    macros: {
        [name: string]: Function;
    };
    _parser: Parser;
    readonly parser: Parser;
    styles(styles: any): void;
    parse(text: string, force?: boolean): string;
    protected styleString(style: any, text: any): void;
    readonly nl: this;
    write(text: string): this;
    writeln(text?: string): this;
    line(text?: string): this;
    dump(...args: any[]): void;
    dumpp(...args: any[]): void;
    macro(name: string, fn?: Function): any;
    tree(label: string, nodes: any[]): this;
    table(options?: any): any[];
    columns(data: any, options?: OutputColumnsOptions, ret?: boolean): any;
    success(text: string): this;
    error(text: string): this;
    warning(text: string): this;
    onExecuteCommandParse(event: CliExecuteCommandParseEvent): void;
    onExecuteCommandParsed(event: CliExecuteCommandParsedEvent): void;
}
