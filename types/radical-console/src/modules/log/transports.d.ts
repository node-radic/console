/// <reference types="winston" />
import { ConsoleTransportOptions, TransportInstance } from 'winston';
export declare function logConsoleTransportFormatter(options: ConsoleTransportOptions): string;
export declare const logTransports: TransportInstance[];
