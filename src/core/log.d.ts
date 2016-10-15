/// <reference types="node" />
import { LoggerInstance, QueryOptions, LogCallback } from "winston";
export declare const LogLevel: {
    ERROR: number;
    WARN: number;
    INFO: number;
    VERBOSE: number;
    DEBUG: number;
    SILLY: number;
};
export interface ILog {
    getTransports(): string[];
    getTransport(transport: string): any;
    setLevel(transport: string, level?: string): this;
    getWinston(): any;
    log(...args: any[]): this;
    query(options: QueryOptions, callback?: (err: Error, results: any) => void): any;
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
export declare class Log implements ILog {
    protected winston: LoggerInstance;
    constructor();
    getTransports(): string[];
    getTransport(transport: string): any;
    setLevel(transport: string, level?: string): this;
    getWinston(): any;
    log(...args: any[]): this;
    query(options: QueryOptions, callback?: (err: Error, results: any) => void): void;
    private _log(name, ...args);
    error(...args: any[]): this;
    warn(...args: any[]): this;
    info(...args: any[]): this;
    verbose(...args: any[]): any;
    debug(...args: any[]): this;
    silly(...args: any[]): this;
    on(event: any, handler: any): void;
    profile(...args: any[]): this;
}
