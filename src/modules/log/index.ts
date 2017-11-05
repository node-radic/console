import { addColors, Logger, TransportInstance } from 'winston';
import { container } from '../../core/Container';
import { logColors, logLevel, logLevels } from './static';
import { logTransports } from './transports';
import { Log, LogLevel } from './interfaces';
import { kindOf } from '@radic/util'

container.constant<TransportInstance[]>('cli.log.transports', logTransports)
container.constant<LogLevel[]>('cli.log.levels', logLevels)
addColors(logColors);
container.bind<Log>('cli.log').toConstantValue((() => {
    return new Logger(<any>{
        level      : 'info',
        rewriters  : [ (level, msg, meta) => {
            return meta;
        } ],
        levels     : logLevel,
        exitOnError: false,
        transports : logTransports
        // exitOnError: false
    });
})());

function setLogLevel(level: LogLevel) {
    if ( kindOf(level) === 'number' ) {
        level = logLevels[ level ]
    }
    container.get<Log>('cli.log').level = level.toString();
}

function setVerbosity(verbosity: number) {
    let level = logLevels.indexOf('info') + verbosity;
    if ( level > logLevels.length - 1 ) {
        level = logLevels.length - 1;
    }
    setLogLevel(<LogLevel> level);
}

export { Log, LogLevel, logColors, setLogLevel, setVerbosity, logLevels,logLevel,logTransports }