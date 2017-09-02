/// <reference types="node" />
/// <reference types="ora" />
import { IOutput, IOutputUtil, OutputOptions, TreeData, TreeOptions } from "./interfaces";
import { Diff } from "../../src";
export declare class Output implements IOutput {
    util: IOutputUtil;
    stdout: NodeJS.WriteStream;
    protected macros: {
        [name: string]: (...args: any[]) => string;
    };
    protected _options: OutputOptions;
    readonly options: OutputOptions;
    readonly nl: this;
    constructor();
    write(text: string): this;
    writeln: (text?: string) => this;
    line: (text?: string) => this;
    dump: (...args: any[]) => this;
    macro<T extends (...args: any[]) => string>(name: string): T;
    setMacro<T extends (...args: any[]) => string>(name: string, macro?: T): any;
    diff: (o: object, o2: object) => Diff;
    spinner: (text?: string) => ora.Ora;
    spinners: any[];
    beep(val?: number, cb?: Function): this;
    tree(obj: TreeData, prefix?: string, opts?: TreeOptions): this;
}
