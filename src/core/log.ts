import {Logger, transports, LoggerInstance, QueryOptions, LogCallback} from "winston";
import {injectable} from "../core";
import * as moment from "moment";


export const LogLevel = {
    ERROR: 0, WARN: 1, INFO: 2, VERBOSE: 3, DEBUG: 4, SILLY: 5
}

export interface ILog
{
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
export class Log implements ILog
{
    protected winston: LoggerInstance

    constructor() {
        this.winston = new (Logger)(<any> {
            transports : [
                new transports.Console({
                    handleExceptions: false,
                    //json            : true,
                    timestamp       : function () {
                        return moment().format('h:mm:ss')
                    },
                    colorize        : true
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

    getTransports(): string[] {
        return Object.keys(this.winston.transports);
    }

    getTransport(transport: string): any {
        return this.winston.transports[transport]
    }

    setLevel(transport: string, level?: string): this {
        if (level) {
            this.winston.transports[transport].level = level;
        } else {
            this.getTransports().forEach((transport: string) => this.setLevel(transport, level))
        }
        return this;
    }

    getWinston(): any {
        return this.winston;
    }

    log(...args: any[]) {
        return this._log('log', args);
    }

    query(options: QueryOptions, callback?: (err: Error, results: any) => void) {
        this.winston.query(options, callback);
    }

    private _log(name: string, ...args: any[]): this {
        this.winston[name].apply(this.winston, args);
        return this
    }

    error(...args: any[]): this {
        return this._log('error', args);
    }

    warn(...args: any[]) {
        return this._log('warn', args);
    }

    info(...args: any[]) {
        return this._log('info', args);
    }

    verbose(...args: any[]) {
        return this.winston.log.apply(this.winston, ['verbose'].concat(args));
    }

    debug(...args: any[]) {
        return this._log('debug', args);
    }

    silly(...args: any[]) {
        return this._log('silly', args);
    }

    on(event, handler) {
        this.winston.on.apply(event, handler)
    }

    profile(...args: any[]) {
        this.winston.profile.apply(this.winston, args);
        return this;
    }
}
