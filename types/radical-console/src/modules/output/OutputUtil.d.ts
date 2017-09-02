import { Figures, TruncateOptions, WrapOptions } from "./interfaces";
import { Output } from "./Output";
export declare class OutputUtil {
    protected output: Output;
    readonly useColors: boolean;
    readonly figures: Figures;
    constructor(output: Output);
    truncate(input: string, columns: number, options?: TruncateOptions): string;
    wrap(input: string, columns: number, options?: WrapOptions): string;
    slice(inputu: string, beginSlice: number, endSlice?: number): string;
    widest(input: string): number;
    width(input: string): number;
}
