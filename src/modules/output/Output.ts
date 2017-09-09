import { merge } from 'lodash'
import { OutputOptions, TreeData, TreeOptions, ColumnsOptions } from "./interfaces";
import { inspect, InspectOptions } from 'util';
import { OutputUtil } from './OutputUtil'
import * as Table from "cli-table2";
import { TableConstructorOptions } from "cli-table2";
import { kindOf } from "@radic/util";
import { Colors, Parser } from "@radic/console-colors";
import { singleton } from "../../core/Container";
import { Diff } from "../../utils/diff";
import requirePeer from "../../utils/require";

@singleton('cli.output')
export class Output {
    protected _parser: Parser
    protected macros: { [name: string]: (...args: any[]) => string }
    protected _options: OutputOptions = {
        enabled: true,
        colors : true,
        inspect: { showHidden: true, depth: 10 }
    }

    public util: OutputUtil;
    public stdout: NodeJS.WriteStream = process.stdout

    get parser(): Parser { return this._parser }

    get colors(): Colors { return this._parser.colors; }

    get options(): OutputOptions { return this._options}

    get nl(): this { return this.write('\n') }

    constructor() {
        this._parser = new Parser()
        this.util    = new OutputUtil(this);
    }

    parse(text: string, force?: boolean): string {return this._parser.parse(text) }

    clean(text: string): string { return this._parser.clean(text)}

    write(text: string): this {
        if ( this.options.colors ) {
            text = this.parse(text);
        } else {
            text = this.clean(text);
        }
        this.stdout.write(text);
        return this;
    }

    writeln(text: string = ''): this { return this.write(text + '\n') }

    line(text: string = ''): this { return this.write(text + '\n')}

    dump(...args: any[]): this {
        this._options.inspect.colors = this._options.colors
        args.forEach(arg => this.line(inspect(arg, this._options.inspect)));
        return this
    }

    macro<T extends (...args: any[]) => string>(name: string): T {
        return <T> ((...args: any[]): string => {
            return this.macros[ name ].apply(this, args)
        })
    }

    setMacro<T extends (...args: any[]) => string>(name: string, macro?: T): any {
        this.macros[ name ] = macro;
        return this
    }

    diff(o: object, o2: object): Diff { return new Diff(o, o2) }

    spinner(text: string = '', options: ora.Options = {}): ora.Ora {
        const ora     = requirePeer<ora.oraFactory>('ora')
        const spinner = ora(options);
        spinner.text  = text;
        return spinner;
    }

    spinners: any[];

    beep(val?: number, cb?: Function): this {
        requirePeer<Function>('beeper')(val)
        return this
    }

    tree(obj: TreeData, opts: TreeOptions = {}, returnValue: boolean = false): string | this {
        let prefix = opts.prefix;
        delete opts.prefix
        let tree = requirePeer('archy')(obj, prefix, opts);
        return returnValue ? tree : this.line(tree);
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
        let CliTable: typeof Table = requirePeer('cli-table2');
        return new CliTable(kindOf(options) === 'array' ? { head: <string[]> options } : <TableConstructorOptions> options)
    }

    columns(data: any, options: ColumnsOptions = {}, ret: boolean = false) {
        let defaults: ColumnsOptions = {
            minWidth        : 20,
            maxWidth        : 120,
            preserveNewLines: true,
            columnSplitter  : ' | '
        }
        let iCol: number             = 0;
        if ( kindOf(data) === 'array' && kindOf(data[ 0 ]) === 'object' ) {
            iCol = Object.keys(data[ 0 ]).length;
        }
        if ( process.stdout.isTTY && iCol > 0 ) {
            // defaults.minWidth = (process.stdout[ 'getWindowSize' ]()[ 0 ] / 1.1) / iCol;
            // defaults.minWidth = defaults.minWidth > defaults.maxWidth ? defaults.maxWidth : defaults.minWidth;
        }
        let res = requirePeer('columnify')(data, merge({}, defaults, options));
        if ( ret ) return res;
        this.writeln(res);
    }
}