/// <reference types="cli-table2" />
/// <reference types="ora" />
import { Parser } from "@radic/console-colors";
import { OutputColumnsOptions, OutputHelperOptionsConfig } from "../interfaces";
import { CliExecuteCommandParsedEvent, CliExecuteCommandParseEvent } from "../core/events";
import * as Table from 'cli-table2';
import { TableConstructorOptions } from 'cli-table2';
export declare class OutputHelper {
    config: OutputHelperOptionsConfig;
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
    /** dump parsed stuff, so no colors **/
    dumpp(...args: any[]): void;
    macro(name: string, fn?: Function): any;
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
