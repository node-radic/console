import { merge } from 'lodash'
import { IConfigProperty, kindOf } from "@radic/util";
import { Parser } from '@radic/console-colors';
import { bindTo, Container, inject } from "../core/ioc";
import { inspect } from "util";
import * as Table from "cli-table2";
import * as archy from "archy";
import { interfaces as i } from '../interfaces'
const tty = require('tty');

const columnify = require('columnify')
const truwrap   = require('truwrap');


// truwrap({})


@bindTo('console.helpers.output')
export default class Output {

    @inject('console.config')
    config: IConfigProperty

    _parser: Parser;
    get parser(): Parser {
        if ( ! this._parser ) {
            this._parser = new Parser;
            this._parser.colors.styles(this.config('helpers.output.styles'));
        }
        return this._parser
    }


    useParser: boolean     = true
    colorsEnabled: boolean = true

    macros: { [name: string]: Function }

    write(text: string): this {

        if ( this.useParser && this.colorsEnabled )
            text = this.parser.parse(text)

        // if ( ! this.colorsEnabled )
        // text = this.parser.clean

        process.stdout.write(text)
        return this
    }

    writeln(text: string = ''): this {
        this.write(text + "\n")
        return this
    }

    line(text: string = ''): this {
        this.writeln(text)
        return this
    }

    get nl(): this {
        this.line()
        return this
    }

    protected styleString(style, text) {
        this.writeln(`{${style}}${text}{/${style}}`)
    }

    dump(...args: any[]): void {
        args.forEach((arg) => this.writeln(inspect(arg, { colors: this.colorsEnabled, depth: 5, showHidden: true })))
    }

    macro(name: string, fn?: Function) {
        if ( fn ) return fn.apply(this, [ this ]);
        this.macros[ name ] = fn
    }

    tree(label: string, nodes: any[]): this {
        let tree = archy(<archy.Data> { label, nodes });
        return this.line(tree)
    }

    success(text: string): this {
        this.styleString('success', text)
        return this
    }

    error(text: string): this {
        this.styleString('error', text)
        return this
    }

    warning(text: string): this {
        this.styleString('error', text)
        return this
    }

    table(options: any = {}): any [] {
        return new Table(kindOf(options) === 'array' ? { head: options } : options)
    }

    columns(data: any, options: i.OutputColumnsOptions = {}) {
        let defaults: i.OutputColumnsOptions = {
            minWidth        : 20,
            maxWidth        : 120,
            preserveNewLines: true,
            columnSplitter  : ' | '
        }
        let iCol: number                     = 0;
        if ( kindOf(data) === 'array' && kindOf(data[ 0 ]) === 'object' ) {
            iCol = Object.keys(data[ 0 ]).length;
        }
        if ( process.stdout.isTTY && iCol > 0 ) {
            // defaults.minWidth = (process.stdout[ 'getWindowSize' ]()[ 0 ] / 1.1) / iCol;
            // defaults.minWidth = defaults.minWidth > defaults.maxWidth ? defaults.maxWidth : defaults.minWidth;
        }
        return columnify(data, merge({}, defaults, options));
    }


    setUseParser(use: boolean) {
        this.useParser = use;
    }

}
