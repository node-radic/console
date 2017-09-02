"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var radical_console_1 = require("radical-console");
var Output_1 = require("./Output");
radical_console_1.Dispatcher.instance.on('helper:resolved:output', function (event) {
    event.helper.output.options.colors = event.helper.config.colors;
    event.helper.output.options.enabled = event.helper.config.quiet !== true;
});
var OutputHelper = /** @class */ (function (_super) {
    __extends(OutputHelper, _super);
    function OutputHelper() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OutputHelper.prototype.styles = function (styles) {
        this.config.styles = _.merge({}, this.config.styles, styles);
        this.parser.colors.styles(this.config.styles);
    };
    OutputHelper.prototype.onExecuteCommandParse = function (event) {
        if (this.config.options.quiet.enabled) {
            event.cli.global(this.config.options.quiet.key, {
                name: this.config.options.quiet.name,
                description: 'Disables all output '
            });
        }
        if (this.config.options.colors.enabled) {
            event.cli.global(this.config.options.colors.key, {
                name: this.config.options.colors.name,
                description: 'Disables color output'
            });
        }
    };
    OutputHelper.prototype.onExecuteCommandParsed = function (event) {
        if (this.config.options.quiet.enabled && event.argv[this.config.options.quiet.key]) {
            this.config.quiet = true;
        }
        if (this.config.options.colors.enabled && event.argv[this.config.options.colors.key]) {
            this.config.colors = false;
        }
    };
    __decorate([
        radical_console_1.inject('cli.output'),
        __metadata("design:type", Output_1.Output)
    ], OutputHelper.prototype, "output", void 0);
    OutputHelper = __decorate([
        radical_console_1.helper('output', {
            singleton: true,
            config: {
                quiet: false,
                colors: true,
                options: {
                    quiet: {
                        enabled: false,
                        key: 'q',
                        name: 'quiet'
                    },
                    colors: {
                        enabled: false,
                        key: 'C',
                        name: 'no-colors'
                    }
                },
                resetOnNewline: true,
                styles: {
                    title: 'yellow bold',
                    subtitle: 'yellow',
                    success: 'green lighten 20 bold',
                    warning: 'orange lighten 20 bold',
                    error: 'red lighten 20 bold',
                },
                tableStyle: {
                    FAT: {
                        'top': '═',
                        'top-mid': '╤',
                        'top-left': '╔',
                        'top-right': '╗',
                        'bottom': '═',
                        'bottom-mid': '╧',
                        'bottom-left': '╚',
                        'bottom-right': '╝',
                        'left': '║',
                        'left-mid': '╟',
                        'mid': '─',
                        'mid-mid': '┼',
                        'right': '║',
                        'right-mid': '╢',
                        'middle': '│'
                    },
                    SLIM: { 'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' },
                    NONE: {
                        'top': '', 'top-mid': '', 'top-left': '', 'top-right': '',
                        'bottom': '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': '',
                        'left': '', 'left-mid': '', 'mid': '', 'mid-mid': '',
                        'right': '', 'right-mid': '', 'middle': ' '
                    }
                }
            },
            listeners: {
                'cli:execute:parse': 'onExecuteCommandParse',
                'cli:execute:parsed': 'onExecuteCommandParsed'
            }
        })
    ], OutputHelper);
    return OutputHelper;
}(Output_1.Output));
exports.OutputHelper = OutputHelper;
// get parser(): Parser { return this.output.parser }
//
// get nl(): this {
//     this.writeln()
//     return this
// }
//
// parse(text: string, force: boolean = false): string { return this.output.parse(text, force); }
//
// clean(text: string): string {return this.output.clean(text)}
//
//
// write(text: string = ''): this {
//     this.output.write(text)
//     return this
// }
//
// writeln(text: string = ''): this {
//     if ( this.config.resetOnNewline ) this.write('{reset}')
//     this.write(text + "\n")
//     return this
// }
//
// line(text: string = ''): this {
//     this.output.line(text)
//     return this
// }
//
// dump(...args: any[]): this {
//     args.forEach((arg) => this.output.dump(arg))
//     return this;
// }
//
// macro<T extends (...args: any[]) => string>(name: string): T {
//     return <T> this.output.macro<T>(name)
// }
//
// setMacro<T extends (...args: any[]) => string>(name: string, macro?: T): any {
//     this.output.setMacro<T>(name, macro);
//     return this
// }
//
// tree(obj: TreeData, opts?: TreeOptions, returnValue: boolean = false): string | this {
//     let result = this.output.tree(obj, opts, returnValue);
//     return returnValue ? <string> result : this
// }
//
// spinner(text: string = '', options: ora.Options = {}): ora.Ora {
//     let spinner  = ora(options)
//     spinner.text = text;
//     return spinner;
//
// }
//
// protected modifiedTable: boolean = false
//
// /**
//  * Integrates the color parser for cells into the table
//  */
// protected modifyTablePush() {
//     if ( this.modifiedTable ) return;
//     const _push                 = Table.prototype.push;
//     let self                    = this;
//     Table.prototype[ 'addRow' ] = function (row: any[]) {
//         this.push(
//             row.map(col => {
//                 if ( kindOf(col) === 'string' ) {
//                     col = self.parse(col)
//                 }
//                 return col;
//             })
//         )
//     }
//     this.modifiedTable          = true;
// }
//
// /**
//  * Create a table
//  * @param {CliTable2.TableConstructorOptions | string[]} options Accepts a options object or header names as string array
//  * @returns {any[]}
//  */
// table(options: TableConstructorOptions | string[] = {}): Table.Table {
//     this.modifyTablePush();
//     return new Table(kindOf(options) === 'array' ? { head: <string[]> options } : <TableConstructorOptions> options)
// }
//
// columns(data: any, options: OutputColumnsOptions = {}, ret: boolean = false) {
//     let defaults: OutputColumnsOptions = {
//         minWidth        : 20,
//         maxWidth        : 120,
//         preserveNewLines: true,
//         columnSplitter  : ' | '
//     }
//     let iCol: number                   = 0;
//     if ( kindOf(data) === 'array' && kindOf(data[ 0 ]) === 'object' ) {
//         iCol = Object.keys(data[ 0 ]).length;
//     }
//     if ( process.stdout.isTTY && iCol > 0 ) {
//         // defaults.minWidth = (process.stdout[ 'getWindowSize' ]()[ 0 ] / 1.1) / iCol;
//         // defaults.minWidth = defaults.minWidth > defaults.maxWidth ? defaults.maxWidth : defaults.minWidth;
//     }
//     let res = require('columnify')(data, merge({}, defaults, options));
//     if ( ret ) return res;
//     this.writeln(res);
// }
//
//
//
// protected styleString(style, text) {
//     this.writeln(`{${style}}${text}{/${style}}`)
// }
//
// success(text: string): this {
//     this.styleString('success', text)
//     return this
// }
//
// error(text: string): this {
//     this.styleString('error', text)
//     return this
// }
//
// warning(text: string): this {
//     this.styleString('error', text)
//     return this
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT3V0cHV0SGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiT3V0cHV0SGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDBCQUE0QjtBQUM1QixtREFBaUw7QUFDakwsbUNBQWtDO0FBRWxDLDRCQUFVLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyx3QkFBd0IsRUFBRSxVQUFDLEtBQWdEO0lBQzlGLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFBO0lBQy9ELEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxLQUFLLElBQUksQ0FBQTtBQUM1RSxDQUFDLENBQUMsQ0FBQTtBQTZERjtJQUFrQyxnQ0FBTTtJQUF4Qzs7SUFxQ0EsQ0FBQztJQTlCRyw2QkFBTSxHQUFOLFVBQU8sTUFBVztRQUNkLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzdELElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFHTSw0Q0FBcUIsR0FBNUIsVUFBNkIsS0FBa0M7UUFDM0QsRUFBRSxDQUFDLENBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQVEsQ0FBQyxDQUFDLENBQUM7WUFDdEMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFD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