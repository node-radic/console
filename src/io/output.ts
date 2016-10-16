import { injectable, inject, BINDINGS, IConfig } from "../core";
import * as Table from "cli-table2";
import { kindOf } from "@radic/util";
import { merge } from "lodash";
import { Parser } from "@radic/console-colors";
import * as archy from "archy";

export interface IOutput
{
    parser: Parser
    tree(label: string, nodex: any[]): this
    writeln(text?: string): this
    line(text?: string): this
    write(text: string): this
    success(text: string): this
    title(text: string): this
    description(text: string): this
    error(text: string): this
    header(text: string): this
    subtitle(text: string): this
    table(options?: any): CliTable
    columns(options?: any): CliTable
}



export const TABLE_STYLE = {
    FAT : {
        'top'     : '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
        , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
        , 'left'  : '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
        , 'right' : '║', 'right-mid': '╢', 'middle': '│'
    },
    SLIM: { chars: { 'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' } },
    NONE: {
        'top'     : '', 'top-mid': '', 'top-left': '', 'top-right': ''
        , 'bottom': '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': ''
        , 'left'  : '', 'left-mid': '', 'mid': '', 'mid-mid': ''
        , 'right' : '', 'right-mid': '', 'middle': ' '
    }
}

@injectable()
export class Output implements IOutput
{
    @inject(BINDINGS.CONFIG)
    config: IConfig;

    parser: Parser         = new Parser;
    useParser: boolean     = true
    colorsEnabled: boolean = true

    tree(label: string, nodes: any[]): this {
        let tree = archy(<archy.Data> { label, nodes });
        return this.line(tree)
    }

    writeln(text: string = ''): this {
        this.write(text + "\n")
        return this
    }

    line(text: string = ''): this {
        this.writeln(text)
        return this
    }

    write(text: string): this {
        if ( this.useParser && this.colorsEnabled )
            text = this.parser.parse(text + '{reset}')

        // if ( ! this.colorsEnabled )
        // text = this.parser.clean

        process.stdout.write(text)
        return this
    }

    success(text: string): this {
        this.configColorString('success', text)
        return this
    }

    error(text: string): this {
        this.configColorString('error', text)
        return this
    }

    protected configColorString(color, text) {
        this.writeln(`{${this.config('colors.' + color)}}${text}`)
    }

    description(text: string): this {
        this.configColorString('description', text)
        return this
    }

    title(text: string): this {
        this.configColorString('title', text)
        return this
    }

    subtitle(text: string): this {
        this.configColorString('subtitle', text)
        return this
    }

    header(text: string): this {
        this.configColorString('header', text)
        return this
    }

    table(options: any = {}): CliTable {
        return new Table(kindOf(options) === 'array' ? { head: options } : options)
    }

    columns(options: any = {}): CliTable {
        let chars = TABLE_STYLE.NONE;
        return new Table(kindOf(options) === 'array' ? merge({ head: options }, { chars }) : merge(options, { chars }))
    }


    setUseParser(use: boolean) {
        this.useParser = use;
    }

}
export default Output
