import { Logger, addColors, config, transports as wtransports,  ConsoleTransportOptions, LoggerInstance, TransportInstance } from "winston";
export interface Log extends LoggerInstance {}
export type LogLevel = 'error' | 'warn' | 'alert' | 'notice' | 'help' | 'info' | 'verbose' | 'data' | 'debug' | 'silly' | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | string | number
