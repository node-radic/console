import { injectable, inject, BINDINGS, IConfig,config } from "../core";
import { inspect } from "util";
import * as Table from "cli-table2";
import { kindOf } from "@radic/util";
import { merge } from "lodash";
import { Parser } from "@radic/console-colors";
import * as archy from "archy";

export interface IOutput {
    parser: Parser
    nl: this
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
    dump(...args: any[]): void;
}

let truwrap = require('truwrap');

// truwrap({})

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
export class Output implements IOutput {

    config: IConfig = config;

    _parser: Parser;
    get parser(): Parser {
        if ( ! this._parser ) {
            this._parser = new Parser;
            this._parser.colors.styles(this.config('styles'));
        }
        return this._parser
    }


    useParser: boolean     = true
    colorsEnabled: boolean = true

    macros: {[name: string]: Function}

    dump(...args: any[]): void {
        args.forEach((arg) => this.writeln(inspect(arg, { colors: this.colorsEnabled, depth: 5, showHidden: true })))
    }

    get nl(): this {
        this.line()
        return this
    }

    macro(name: string, fn?: Function) {
        if ( fn ) return fn.apply(this, [ this ]);
        this.macros[ name ] = fn
    }

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
            text = this.parser.parse(text)

        // if ( ! this.colorsEnabled )
        // text = this.parser.clean

        process.stdout.write(text)
        return this
    }

    success(text: string): this {
        this.styleString('success', text)
        return this
    }

    error(text: string): this {
        this.styleString('error', text)
        return this
    }

    protected styleString(style, text) {
        this.writeln(`{${style}}${text}{/${style}}`)
    }

    description(text: string): this {
        this.styleString('description', text)
        return this
    }

    title(text: string): this {
        this.styleString('title', text)
        return this
    }

    subtitle(text: string): this {
        this.styleString('subtitle', text)
        return this
    }

    header(text: string): this {
        this.styleString('header', text)
        return this
    }

    table(options: any = {}): CliTable {
        return new Table(kindOf(options) === 'array' ? { head: options } : options)
    }

    columns(options: any = {}): CliTable {
        let chars = TABLE_STYLE.NONE;
        options = kindOf(options) === 'array' ? merge({ head: options }, { chars }) : merge(options, { chars })
        return new Table(options)
    }


    setUseParser(use: boolean) {
        this.useParser = use;
    }

}
export default Output
