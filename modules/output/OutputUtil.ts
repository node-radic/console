import { Figures, IOutput, IOutputUtil, TruncateOptions, WrapOptions } from "./interfaces";
import { figures } from 'radical-console'
import { Colors, Parser } from '@radic/console-colors'
import * as truncate from 'cli-truncate'
import * as wrap from 'wrap-ansi'
import * as slice from 'slice-ansi'
import * as widest from 'widest-line'
import * as width from 'string-width'

export class OutputUtil implements IOutputUtil {
    protected _useColors: boolean = true;
    protected _parser: Parser

    get parser(): Parser { return this._parser }

    get colors(): Colors { return this._parser.colors; }

    get useColors(): boolean {return this._useColors}

    get figures(): Figures { return figures}

    constructor(protected output: IOutput) { this._parser = new Parser }

    disableColors(): this {
        this._useColors = false;
        return this
    }

    enableColors(): this {
        this._useColors = true;
        return this
    }

    parse(text: string, force?: boolean): string {return this._parser.parse(text) }

    clean(text: string): string { return this._parser.clean(text)}

    truncate(input: string, columns: number, options?: TruncateOptions): string { return truncate.apply(truncate, arguments)}

    wrap(input: string, columns: number, options?: WrapOptions): string { return wrap.apply(wrap, arguments)}

    slice(inputu: string, beginSlice: number, endSlice?: number): string { return slice.apply(slice, arguments)}

    widest(input: string): number { return widest.apply(widest, arguments)}

    width(input: string): number { return width.apply(width, arguments)}


}
