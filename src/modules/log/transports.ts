import { config, ConsoleTransportOptions, TransportInstance, transports as wtransports } from 'winston';
import { Parser } from '@radic/console-colors';
import * as util from 'util';
import { Helpers } from '../../core/Helpers';
import { OutputHelper } from '../output/OutputHelper';
import { container } from '../../core/Container';
import { figures } from '../output/figures';
import { Cli } from '../../core/Cli';

export function logConsoleTransportFormatter(options: ConsoleTransportOptions) {
    let meta   = options[ 'meta' ];
    let output = '';
    if ( meta !== null && meta !== undefined ) {
        if ( meta && meta instanceof Error && meta.stack ) {
            meta = meta.stack;
        }
        if ( typeof meta !== 'object' ) {
            output += '' + meta;
        }
        else if ( Object.keys(meta).length > 0 ) {
            if ( typeof options.prettyPrint === 'function' ) {
                output += '' + options.prettyPrint(meta);
            } else if ( options.prettyPrint ) {
                output += '' + util.inspect(meta, false, options.depth || null, options.colorize);
            } else if (
                options.humanReadableUnhandledException
                && Object.keys(meta).length === 5
                && meta.hasOwnProperty('date')
                && meta.hasOwnProperty('process')
                && meta.hasOwnProperty('os')
                && meta.hasOwnProperty('trace')
                && meta.hasOwnProperty('stack') ) {

                //
                // If meta carries unhandled exception data serialize the stack nicely
                //
                var stack = meta.stack;
                delete meta.stack;
                delete meta.trace;
                output += '' + exports.serialize(meta);

                if ( stack ) {
                    output += stack.join('\n');
                }
            } else {
                output += '' + exports.serialize(meta);
            }
        }
    }

    return output;

}

//[ 'error', 'warn', 'alert', 'notice', 'help', 'info', 'verbose', 'data', 'debug', 'silly' ]
let levelIcons                                  = {
    error  : figures.circleCross,
    warn   : figures.warning,
    alert  : figures.circlePipe,
    notice : '{bold}!{/bold}',
    help   : figures.circleQuestionMark,
    info   : figures.info,
    verbose: figures.info.repeat(2),
    data   : figures.info.repeat(3),
    debug  : figures.hamburger,
    silly  : figures.smiley
}
let parser: Parser                              = new Parser;
export const logTransports: TransportInstance[] = [
    new (wtransports.Console)({
        // json       : true,
        colorize   : true,
        prettyPrint: true,

        // timestamp  : true,
        showLevel: true,
        formatter: function (options: ConsoleTransportOptions) {
            let cli = container.get<Cli>('cli')
            if ( container.get<Helpers>('cli.helpers').isEnabled('output') ) {
                const out        = container.get<OutputHelper>('cli.helpers.output')
                options.colorize = out.config.colors
                parser           = out.parser;
            }
            // Return string will be passed to logger.
            let message = options[ 'message' ] ? options[ 'message' ] : ''
            let color   = config.syslog.colors[ options.level ] || config.cli.colors[ options.level ]
            let level   = options.level;
            if( cli.config('log.useLevelIcons') && options.level in levelIcons){
                level = levelIcons[options.level] + ' ' + level
            }
            if ( options.colorize ) {
                message = parser.parse(message);
                level   = parser.parse(`{${color}}${level}{/${color}}`)
            }
            let meta: any  = logConsoleTransportFormatter(options);
            let metaPrefix = meta.length > 200 ? '\n' : '\t'
            return `${level} :: ${message} ${metaPrefix}${meta}`
            // level           : 'info',
            // handleExceptions: true,
            // label: string|null;
            // formatter(opts?:ConsoleTransportOptions) : string{
            //     return opts['message'];
            // }
        }
    })
];