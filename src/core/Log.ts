import * as winston from "winston";
import { ConsoleTransportOptions, LoggerInstance } from "winston";
import { container } from "./Container";
import { Parser } from "@radic/console-colors";
import { kindOf } from "@radic/util";
import * as util from "util";


export interface Log extends LoggerInstance {}


export type LogLevel = 'error' | 'warn' | 'alert' | 'notice' | 'help' | 'info' | 'verbose' | 'data' | 'debug' | 'silly' | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export const logLevels: LogLevel[] = [ 'error', 'warn', 'alert', 'notice', 'help', 'info', 'verbose', 'data', 'debug', 'silly' ]

let levels = {},
    colors = {};
logLevels.forEach((level, index) => {
    levels[ level ] = index;
    colors[ level ] = winston.config.cli.colors[ level ] ? winston.config.cli.colors[ level ] : winston.config.syslog.colors[ level ]
})

export class LogFactory {
    protected logLevels: LogLevel[] = [ 'error', 'warn', 'alert', 'notice', 'help', 'info', 'verbose', 'data', 'debug', 'silly' ]
    public static log: Log;
    private static parser           = new Parser()
    public static transports        = [ new (winston.transports.Console)({
        // json       : true,
        colorize   : true,
        prettyPrint: true,

        // timestamp  : true,
        showLevel: true,
        formatter: function (options: ConsoleTransportOptions) {
            // Return string will be passed to logger.
            let message    = options[ 'message' ] ? options[ 'message' ] : ''
            let color      = winston.config.syslog.colors[ options.level ] || winston.config.cli.colors[ options.level ]
            let level      = this.parser.parse(`{${color}}${options.level}{/${color}}`)
            let meta: any  = this.getConsoleMeta(options);
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
    ]

    public static setLogLevel(level: LogLevel) {
        if ( kindOf(level) === 'number' ) {
            level = logLevels[ level ]
        }
        this.log.level = level.toString();
    }

    public static setVerbosity(verbosity: number) {
        let level = logLevels.indexOf('info') + verbosity;
        if ( level > logLevels.length ) {
            level = logLevels.length - 1;
        }
        LogFactory.setLogLevel(<LogLevel> level);
    }


    public static init() {

        let transports = LogFactory.transports
        const log: Log = new winston.Logger(<any>{
            level      : 'info',
            rewriters  : [ (level, msg, meta) => {
                return meta;
            } ],
            levels,
            exitOnError: false,
            transports
        })
        LogFactory.log = log;

        winston.addColors(colors);

        if ( ! container.isBound('cli.log') ) {

             container.constant('cli.log', log);
            return
        }
        container.rebind('cli.log').toConstantValue(log)


    }

    protected static getConsoleMeta(options: ConsoleTransportOptions) {
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
}

LogFactory.init()
export const log: Log = LogFactory.log