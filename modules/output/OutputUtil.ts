import { figures } from 'radical-console'
import { Colors, Parser } from '@radic/console-colors'
import * as truncate from 'cli-truncate'
import * as wrap from 'wrap-ansi'
import * as slice from 'slice-ansi'
import * as widest from 'widest-line'
import * as width from 'string-width'
import { Figures, TruncateOptions, WrapOptions } from "./interfaces";
import { Output } from "./Output";


export class OutputUtil {

    get useColors(): boolean {return this.output.options.colors }

    get figures(): Figures { return figures}

    constructor(protected output: Output) {  }

    truncate(input: string, columns: number, options?: TruncateOptions): string { return truncate.apply(truncate, arguments)}

    wrap(input: string, columns: number, options?: WrapOptions): string { return wrap.apply(wrap, arguments)}

    slice(inputu: string, beginSlice: number, endSlice?: number): string { return slice.apply(slice, arguments)}

    widest(input: string): number { return widest.apply(widest, arguments)}

    width(input: string): number { return width.apply(width, arguments)}


}
