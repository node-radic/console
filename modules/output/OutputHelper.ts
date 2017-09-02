import * as _ from "lodash";
import { merge } from "lodash";
import { kindOf } from "@radic/util";
import { Parser } from "@radic/console-colors";
import { inspect } from "util";
import { CliExecuteCommandParsedEvent, CliExecuteCommandParseEvent, helper, inject, OutputColumnsOptions, OutputHelperOptionsConfig } from "radical-console";
import * as ora from 'ora'

const tty = require('tty');
import * as Table from 'cli-table2';
import { TableConstructorOptions } from 'cli-table2'
import { Output } from "./Output";


@helper('output', {
    singleton: true,
    config   : {
        quiet         : false,
        colors        : true,
        options       : {
            quiet : {
                enabled: false,
                key    : 'q',
                name   : 'quiet'
            },
            colors: {
                enabled: false,
                key    : 'C',
                name   : 'no-colors'
            }
        },
        resetOnNewline: true,
        styles        : {
            title   : 'yellow bold',
            subtitle: 'yellow',

            success: 'green lighten 20 bold',
            warning: 'orange lighten 20 bold',
            error  : 'red lighten 20 bold',

        },
        tableStyle    : {
            FAT : {
                'top'         : '═',
                'top-mid'     : '╤',
                'top-left'    : '╔',
                'top-right'   : '╗',
                'bottom'      : '═',
                'bottom-mid'  : '╧',
                'bottom-left' : '╚',
                'bottom-right': '╝',
                'left'        : '║',
                'left-mid'    : '╟',
                'mid'         : '─',
                'mid-mid'     : '┼',
                'right'       : '║',
                'right-mid'   : '╢',
                'middle'      : '│'
            },
            SLIM: { 'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' },
            NONE: {
                'top'     : '', 'top-mid': '', 'top-left': '', 'top-right': ''
                , 'bottom': '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': ''
                , 'left'  : '', 'left-mid': '', 'mid': '', 'mid-mid': ''
                , 'right' : '', 'right-mid': '', 'middle': ' '
            }
        }
    },
    listeners: {
        'cli:execute:parse' : 'onExecuteCommandParse',
        'cli:execute:parsed': 'onExecuteCommandParsed'
    }
})
export class OutputHelper {
    config: OutputHelperOptionsConfig;

    @inject('cli.output')
    output: Output

    get parser(): Parser { return this.output.util.parser }

    styles(styles: any) {
        this.config.styles = _.merge({}, this.config.styles, styles);
        this.parser.colors.styles(this.config.styles);
    }

    parse(text: string, force: boolean = false) {
        return this.output.util.parse(text, force);
    }

    protected styleString(style, text) {
        this.writeln(`{${style}}${text}{/${style}}`)
    }

    get nl(): this {
        this.writeln()
        return this
    }

    write(text: string = ''): this {
        this.output.write(text)
        return this
    }

    writeln(text: string = ''): this {
        if ( this.config.resetOnNewline ) this.write('{reset}')
        this.write(text + "\n")
        return this
    }

    line(text: string = ''): this {
        this.output.line(text)
        return this
    }

    dump(...args: any[]): this {
        args.forEach((arg) => this.output.dump(arg))
        return this;
    }

    macro<T extends (...args: any[]) => string>(name: string): T {
        return <T> this.output.macro<T>(name)
    }

    setMacro<T extends (...args: any[]) => string>(name: string, macro?: T): any {
        this.output.setMacro<T>(name, macro);
        return this
    }

    tree(label: string, nodes: any[]): this {
        let tree = require('archy')(<any> { label, nodes });
        return this.line(tree)
    }

    protected modifiedTable: boolean = false

    /**
     * Integrates the color parser for cells into the table
     */
    protected modifyTablePush() {
        if ( this.modifiedTable ) return;
        const _push                 = Table.prototype.push;
        let self                    = this;
        Table.prototype[ 'addRow' ] = function (row: any[]) {
            this.push(
                row.map(col => {
                    if ( kindOf(col) === 'string' ) {
                        col = self.parse(col)
                    }
                    return col;
                })
            )
        }
        this.modifiedTable          = true;
    }

    /**
     * Create a table
     * @param {CliTable2.TableConstructorOptions | string[]} options Accepts a options object or header names as string array
     * @returns {any[]}
     */
    table(options: TableConstructorOptions | string[] = {}): Table.Table {
        this.modifyTablePush();
        return new Table(kindOf(options) === 'array' ? { head: <string[]> options } : <TableConstructorOptions> options)
    }

    columns(data: any, options: OutputColumnsOptions = {}, ret: boolean = false) {
        let defaults: OutputColumnsOptions = {
            minWidth        : 20,
            maxWidth        : 120,
            preserveNewLines: true,
            columnSplitter  : ' | '
        }
        let iCol: number                   = 0;
        if ( kindOf(data) === 'array' && kindOf(data[ 0 ]) === 'object' ) {
            iCol = Object.keys(data[ 0 ]).length;
        }
        if ( process.stdout.isTTY && iCol > 0 ) {
            // defaults.minWidth = (process.stdout[ 'getWindowSize' ]()[ 0 ] / 1.1) / iCol;
            // defaults.minWidth = defaults.minWidth > defaults.maxWidth ? defaults.maxWidth : defaults.minWidth;
        }
        let res = require('columnify')(data, merge({}, defaults, options));
        if ( ret ) return res;
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

    spinner(text: string = '', options: ora.Options = {}): ora.Ora {
        let spinner  = ora(options)
        spinner.text = text;
        return spinner;

    }


    public onExecuteCommandParse(event: CliExecuteCommandParseEvent) {
        if ( this.config.options.quiet.enabled ) {
            event.cli.global(this.config.options.quiet.key, {
                name       : this.config.options.quiet.name,
                description: 'Disables all output '
            })
        }
        if ( this.config.options.colors.enabled ) {
            event.cli.global(this.config.options.colors.key, {
                name       : this.config.options.colors.name,
                description: 'Disables color output'
            })
        }
    }

    public onExecuteCommandParsed(event: CliExecuteCommandParsedEvent) {
        if ( this.config.options.quiet.enabled && event.argv[ this.config.options.quiet.key ] ) {
            this.config.quiet = true
        }
        if ( this.config.options.colors.enabled && event.argv[ this.config.options.colors.key ] ) {
            this.config.colors = false;
        }
    }

}
