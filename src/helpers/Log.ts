import { Winston } from "winston";
import * as winston from 'winston'

export interface LogCallback {
    (error?: any, level?: string, msg?: string, meta?: any): void;
}

export class Log {
    protected _winston: Winston;
    get winston(): Winston {
        return this._winston;
    }

    constructor() {
        this._winston = winston;
    }


    log(level: string, msg: string, callback: LogCallback)
    log(level: string, msg: string, meta: any, callback: LogCallback)
    log(level: string, msg: string, ...meta: any[])
    log(...args: any[]): this {
        this.winston.log.apply(winston, args);
        return this
    }
}