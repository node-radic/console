/// <reference types="node" />
/// <reference types="ora" />
/// <reference types="cli-table2" />
import { OutputOptions, TreeData, TreeOptions, ColumnsOptions } from "./interfaces";
import { OutputUtil } from './OutputUtil';
import * as Table from "cli-table2";
import { TableConstructorOptions } from "cli-table2";
import { Colors, Parser } from "@radic/console-colors";
import { Diff } from "../../utils/diff";
export declare class Output {
    protected _parser: Parser;
    protected macros: {
        [name: string]: (...args: any[]) => string;
    };
    protected _options: OutputOptions;
    util: OutputUtil;
    stdout: NodeJS.WriteStream;
    readonly parser: Parser;
    readonly colors: Colors;
    readonly options: OutputOptions;
    readonly nl: this;
    constructor();
    parse(text: string, force?: boolean): string;
    clean(text: string): string;
    write(text: string): this;
    writeln(text?: string): this;
    line(text?: string): this;
    dump(...args: any[]): this;
    macro<T extends (...args: any[]) => string>(name: string): T;
    setMacro<T extends (...args: any[]) => string>(name: string, macro?: T): any;
    diff(o: object, o2: object): Diff;
    spinner(text?: string, options?: ora.Options): ora.Ora;
    spinners: any[];
    beep(val?: number, cb?: Function): this;
    tree(obj: TreeData, opts?: TreeOptions, returnValue?: boolean): string | this;
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
    columns(data: any, options?: ColumnsOptions, ret?: boolean): any;
}
