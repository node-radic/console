import { Logger, transports, LoggerInstance, QueryOptions, LogCallback, ConsoleTransportOptions} from "winston";
import * as Winston from 'winston';
import { injectable } from "../core";
import * as moment from "moment";
import { inspect } from "util";


export const LogLevel = {
    error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5
}

export interface ILog {
    getTransports(): string[]
    getTransport(transport: string): any
    setLevel(transport: string, level?: string): this
    getWinston(): any
    log(...args: any[]): this
    query(options: QueryOptions, callback?: (err: Error, results: any) => void)
    error(msg: string, callback: LogCallback): this;
    error(msg: string, meta: any, callback: LogCallback): this;
    error(msg: string, ...meta: any[]): this;
    warn(msg: string, callback: LogCallback): this;
    warn(msg: string, meta: any, callback: LogCallback): this;
    warn(msg: string, ...meta: any[]): this;
    info(msg: string, callback: LogCallback): this;
    info(msg: string, meta: any, callback: LogCallback): this;
    info(msg: string, ...meta: any[]): this;
    verbose(msg: string, callback: LogCallback): this;
    verbose(msg: string, meta: any, callback: LogCallback): this;
    verbose(msg: string, ...meta: any[]): this;
    debug(msg: string, callback: LogCallback): this;
    debug(msg: string, meta: any, callback: LogCallback): this;
    debug(msg: string, ...meta: any[]): this;
    silly(msg: string, callback: LogCallback): this;
    silly(msg: string, meta: any, callback: LogCallback): this;
    silly(msg: string, ...meta: any[]): this;
    profile(id: string, msg?: string, meta?: any, callback?: (err: Error, level: string, msg: string, meta: any) => void): this;
}

@injectable()
export class Log implements ILog {
    protected winston: LoggerInstance

    constructor() {
        this.winston = new (Logger)(<any> {
            transports : [
                new transports.Console(<ConsoleTransportOptions> {
                    handleExceptions: false,
                    //json            : true,
                    timestamp       : function () {
                        return moment().format('h:mm:ss')
                    },
                    prettyPrint: true,
                    formatter: (options:any) => {
                        let level = Winston['config'].colorize(options.level, options.level.toUpperCase())
                        let timestamp = options.level === 'error' || options.level === 'debug' ? `[${options.timestamp()}] ` : ''
                        let out = `${timestamp}${level} ::  ${options.message ? options.message : ''}`
                        if(options.meta && Object.keys(options.meta).length )
                            out += '\n '+ inspect(options.meta, {colors:true, depth: 5, showHidden: true })
                        return out;
                    }
                })
            ],
            // rewriters   : [
            //     (level:any, msg:any, meta:any) => {
            //         let a = meta
            //         return meta
            //     }
            // ],
            exitOnError: false
        })
    }


    private _log(name: string, args: any[]): this {
        this.winston.log.apply(this.winston, [ name ].concat(args))
        return this
    }

    setLevel(transport: string, level?: string): this {
        if ( level ) {
            this.winston.transports[ transport ].level = this.parseLevel(level);
        } else {
            level = this.parseLevel(transport);
            this.getTransports().forEach((name: string) => this.winston.transports[ name ].level = level)
        }
        return this;
    }

    protected parseLevel(level:any):string{
        let levels = Object.keys(LogLevel);
        if(typeof level === 'number') return levels[level]
        if(isFinite(level)) return levels[parseInt(level)]
        return level
    }

    getTransports(): string[] { return Object.keys(this.winston.transports); }

    getTransport(transport: string): any { return this.winston.transports[ transport ] }

    getLevel() { return this.winston.level}

    getWinston(): any { return this.winston; }

    log(...args: any[]) { return this._log('log', args); }

    query(options: QueryOptions, callback?: (err: Error, results: any) => void) { this.winston.query(options, callback); }

    error(...args: any[]): this { return this._log('error', args); }

    warn(...args: any[]) { return this._log('warn', args); }

    info(...args: any[]) { return this._log('info', args); }

    // verbose(...args: any[]) { return this.winston.log.apply(this.winston, [ 'verbose' ].concat(args)); }
    verbose(...args: any[]) { return this._log('verbose', args); }

    debug(...args: any[]) { return this._log('debug', args); }

    silly(...args: any[]) { return this._log('silly', args); }

    on(event, handler) {this.winston.on.apply(event, handler) }

    profile(...args: any[]) {
        this.winston.profile.apply(this.winston, args);
        return this;
    }
}
