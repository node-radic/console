import { IConfig } from "../core";
import { Parser } from "@radic/console-colors";
export interface IOutput {
    parser: Parser;
    tree(label: string, nodex: any[]): this;
    writeln(text?: string): this;
    line(text?: string): this;
    write(text: string): this;
    success(text: string): this;
    title(text: string): this;
    description(text: string): this;
    error(text: string): this;
    header(text: string): this;
    subtitle(text: string): this;
    table(options?: any): CliTable;
    columns(options?: any): CliTable;
}
export declare const TABLE_STYLE: {
    FAT: {
        'top': string;
        'top-mid': string;
        'top-left': string;
        'top-right': string;
        'bottom': string;
        'bottom-mid': string;
        'bottom-left': string;
        'bottom-right': string;
        'left': string;
        'left-mid': string;
        'mid': string;
        'mid-mid': string;
        'right': string;
        'right-mid': string;
        'middle': string;
    };
    SLIM: {
        chars: {
            'mid': string;
            'left-mid': string;
            'mid-mid': string;
            'right-mid': string;
        };
    };
    NONE: {
        'top': string;
        'top-mid': string;
        'top-left': string;
        'top-right': string;
        'bottom': string;
        'bottom-mid': string;
        'bottom-left': string;
        'bottom-right': string;
        'left': string;
        'left-mid': string;
        'mid': string;
        'mid-mid': string;
        'right': string;
        'right-mid': string;
        'middle': string;
    };
};
export declare class Output implements IOutput {
    config: IConfig;
    parser: Parser;
    useParser: boolean;
    colorsEnabled: boolean;
    tree(label: string, nodes: any[]): this;
    writeln(text?: string): this;
    line(text?: string): this;
    write(text: string): this;
    success(text: string): this;
    error(text: string): this;
    protected configColorString(color: any, text: any): void;
    description(text: string): this;
    title(text: string): this;
    subtitle(text: string): this;
    header(text: string): this;
    table(options?: any): CliTable;
    columns(options?: any): CliTable;
    setUseParser(use: boolean): void;
}
export default Output;
