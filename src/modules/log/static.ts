import { config } from 'winston';
import { LogLevel } from './interfaces';

export const logLevels: LogLevel[] = [ 'error', 'warn', 'alert', 'notice', 'help', 'info', 'verbose', 'data', 'debug', 'silly' ]

export let logLevel  = {};
export let logColors = {};
logLevels.forEach((level, index) => {
    logLevel[ level ]  = index;
    logColors[ level ] = config.cli.colors[ level ] ? config.cli.colors[ level ] : config.syslog.colors[ level ]
})