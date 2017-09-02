import { Figures, IOutput, IOutputUtil, TruncateOptions, WrapOptions } from "./interfaces";
import { Colors, Parser } from '@radic/console-colors';
export declare class OutputUtil implements IOutputUtil {
    protected output: IOutput;
    protected _useColors: boolean;
    protected _parser: Parser;
    readonly parser: Parser;
    readonly colors: Colors;
    readonly useColors: boolean;
    readonly figures: Figures;
    constructor(output: IOutput);
    disableColors(): this;
    enableColors(): this;
    parse(text: string, force?: boolean): string;
    clean(text: string): string;
    truncate(input: string, columns: number, options?: TruncateOptions): string;
    wrap(input: string, columns: number, options?: WrapOptions): string;
    slice(inputu: string, beginSlice: number, endSlice?: number): string;
    widest(input: string): number;
    width(input: string): number;
}
