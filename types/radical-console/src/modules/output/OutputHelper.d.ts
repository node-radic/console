/// <reference types="cli-table2" />
/// <reference types="ora" />
import { Parser } from "@radic/console-colors";
import { CliExecuteCommandParsedEvent, CliExecuteCommandParseEvent, OutputColumnsOptions, OutputHelperOptionsConfig } from "radical-console";
import * as Table from 'cli-table2';
import { TableConstructorOptions } from 'cli-table2';
import { Output } from "./Output";
export declare class OutputHelper {
    config: OutputHelperOptionsConfig;
    output: Output;
    readonly parser: Parser;
    styles(styles: any): void;
    parse(text: string, force?: boolean): string;
    protected styleString(style: any, text: any): void;
    readonly nl: this;
    write(text?: string): this;
    writeln(text?: string): this;
    line(text?: string): this;
    dump(...args: any[]): this;
    macro<T extends (...args: any[]) => string>(name: string): T;
    setMacro<T extends (...args: any[]) => string>(name: string, macro?: T): any;
    tree(label: string, nodes: any[]): this;
    protected modifiedTable: boolean;
    /**
     * Integrates the color parser for cells into the table
     */
    protected modifyTablePush(): void;
    /**
     * Create a table
     * @param {CliTable2.TableConstructorOptions | string[]} options Accepts a options object or header names as string array
     * @returns {any[]}
     */
    table(options?: TableConstructorOptions | string[]): Table.Table;
    columns(data: any, options?: OutputColumnsOptions, ret?: boolean): any;
    success(text: string): this;
    error(text: string): this;
    warning(text: string): this;
    spinner(text?: string, options?: ora.Options): ora.Ora;
    onExecuteCommandParse(event: CliExecuteCommandParseEvent): void;
    onExecuteCommandParsed(event: CliExecuteCommandParsedEvent): void;
}
