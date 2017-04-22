import { merge } from "lodash";
import { kindOf } from "@radic/util";
import { Parser } from "@radic/console-colors";
import { inspect } from "util";
import * as Table from "cli-table2";
import * as archy from "archy";
import { interfaces as i } from "../interfaces";
import { helper } from "../decorators";
const tty       = require('tty');
const columnify = require('columnify')
const truwrap   = require('truwrap');

// truwrap({})


@helper('output', {
    singleton: true,
    config   : {
        quiet : false,
        colors: true,
        resetOnNewline: true,
        styles    : {
            title   : 'yellow bold',
            subtitle: 'yellow',

            success: 'green lighten 20 bold',
            warning: 'orange lighten 20 bold',
            error  : 'red lighten 20 bold',

            header     : 'darkorange bold',
            group      : 'steelblue bold',
            command    : 'darkcyan',
            description: 'darkslategray',
            desc       : '<%= helpers.output.styles.description %>', // alias

            argument   : 'yellow darken 25',

            optional: 'yellow',
            type    : 'yellow'
        },
        tableStyle: {
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
    }
})
export class Output {
    config: i.HelperOptionsConfig;
    macros: { [name: string]: Function }
    _parser: Parser;

    get parser(): Parser {
        if ( ! this._parser ) {
            this._parser = new Parser;
            this._parser.colors.styles(this.config.styles);
        }
        return this._parser
    }

    parse(text: string, force: boolean = false) {

        if ( this.config.colors || force ) {
            text = this.parser.parse(text)
        } else if ( ! this.config.colors ) {
            // @todo parser clean
            // text = this.parser.clean(text);
        }
        return text;
    }

    protected styleString(style, text) {
        this.writeln(`{${style}}${text}{/${style}}`)
    }

    get nl(): this {
        this.writeln()
        return this
    }

    write(text: string): this {
        if ( this.config.quiet ) return this

        if ( this.config.colors )
            text = this.parser.parse(text)
        else
            text = this.parser.clean(text);

        // if ( ! this.colorsEnabled )
        // text = this.parser.clean

        process.stdout.write(text)
        return this
    }

    writeln(text: string = ''): this {
        if(this.config.resetOnNewline) this.write('{reset}')
        this.write(text + "\n")
        return this
    }

    line(text: string = ''): this {
        this.writeln(text)
        return this
    }

    dump(...args: any[]): void {
        args.forEach((arg) => this.writeln(inspect(arg, { colors: this.config.colors, depth: 5, showHidden: true })))
    }

    /** dump parsed stuff, so no colors **/
    dumpp(...args: any[]): void {
        args.forEach((arg) => this.writeln(inspect(arg, { colors: false, depth: 5, showHidden: true })))
    }

    macro(name: string, fn?: Function) {
        if ( fn ) return fn.apply(this, [ this ]);
        this.macros[ name ] = fn
    }

    tree(label: string, nodes: any[]): this {
        let tree = archy(<archy.Data> { label, nodes });
        return this.line(tree)
    }

    table(options: any = {}): any [] {
        return new Table(kindOf(options) === 'array' ? { head: options } : options)
    }

    columns(data: any, options: i.OutputColumnsOptions = {}, ret:boolean = false) {
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
        let res = columnify(data, merge({}, defaults, options));
        if(ret) return res;
        this.writeln(res);
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
}
