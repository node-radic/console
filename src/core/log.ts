import * as winston from "winston";
import { container } from "./Container";
import { ConsoleTransportInstance, ConsoleTransportOptions, LoggerInstance } from "winston";

const log:LoggerInstance = new winston.Logger({
    level     : 'info',
    transports: [
        new ( winston.transports.Console)(<ConsoleTransportOptions|ConsoleTransportInstance> {
            colorize: true,
            showLevel: true,
            prettyPrint: true,
            align: true
        })
    ]
})
export {log,LoggerInstance}
container.bind('cli.log').toConstantValue(winston);