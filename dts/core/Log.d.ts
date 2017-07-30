import { ConsoleTransportOptions, LoggerInstance, TransportInstance } from "winston";
import { Parser } from "@radic/console-colors";
export { LoggerInstance };
export interface Log extends LoggerInstance {
}
export declare function getConsoleMeta(options: ConsoleTransportOptions): string;
export declare const parser: Parser;
export declare const transports: TransportInstance[];
export declare type LogLevel = 'error' | 'warn' | 'alert' | 'notice' | 'help' | 'info' | 'verbose' | 'data' | 'debug' | 'silly' | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export declare const logLevels: LogLevel[];
export declare let levels: {};
export declare let colors: {};
export declare function setLogLevel(level: LogLevel): void;
export declare function setVerbosity(verbosity: number): void;
