import * as winston from "winston";
import { container } from "./Container";
import { Parser } from "@radic/console-colors";
import { kindOf } from "@radic/util";
import * as util from "util";
export function getConsoleMeta(options) {
    var meta = options['meta'];
    var output = '';
    if (meta !== null && meta !== undefined) {
        if (meta && meta instanceof Error && meta.stack) {
            meta = meta.stack;
        }
        if (typeof meta !== 'object') {
            output += '' + meta;
        }
        else if (Object.keys(meta).length > 0) {
            if (typeof options.prettyPrint === 'function') {
                output += '' + options.prettyPrint(meta);
            }
            else if (options.prettyPrint) {
                output += '' + util.inspect(meta, false, options.depth || null, options.colorize);
            }
            else if (options.humanReadableUnhandledException
                && Object.keys(meta).length === 5
                && meta.hasOwnProperty('date')
                && meta.hasOwnProperty('process')
                && meta.hasOwnProperty('os')
                && meta.hasOwnProperty('trace')
                && meta.hasOwnProperty('stack')) {
                var stack = meta.stack;
                delete meta.stack;
                delete meta.trace;
                output += '' + exports.serialize(meta);
                if (stack) {
                    output += stack.join('\n');
                }
            }
            else {
                output += '' + exports.serialize(meta);
            }
        }
    }
    return output;
}
export var parser = new Parser();
export var transports = [
    new (winston.transports.Console)({
        colorize: true,
        prettyPrint: true,
        showLevel: true,
        formatter: function (options) {
            var message = options['message'] ? options['message'] : '';
            var color = winston.config.syslog.colors[options.level] || winston.config.cli.colors[options.level];
            var level = parser.parse("{" + color + "}" + options.level + "{/" + color + "}");
            var meta = getConsoleMeta(options);
            var metaPrefix = meta.length > 200 ? '\n' : '\t';
            return level + " :: " + message + " " + metaPrefix + meta;
        }
    })
];
export var logLevels = ['error', 'warn', 'alert', 'notice', 'help', 'info', 'verbose', 'data', 'debug', 'silly'];
export var levels = {};
export var colors = {};
logLevels.forEach(function (level, index) {
    levels[level] = index;
    colors[level] = winston.config.cli.colors[level] ? winston.config.cli.colors[level] : winston.config.syslog.colors[level];
});
winston.addColors(colors);
container.bind('cli.log').toDynamicValue(function (ctx) {
    return new winston.Logger({
        level: 'info',
        rewriters: [function (level, msg, meta) {
                return meta;
            }],
        levels: levels,
        exitOnError: false,
        transports: transports,
    });
});
export function setLogLevel(level) {
    if (kindOf(level) === 'number') {
        level = logLevels[level];
    }
    container.get('cli.log').level = level.toString();
}
export function setVerbosity(verbosity) {
    var level = logLevels.indexOf('info') + verbosity;
    if (level > logLevels.length - 1) {
        level = logLevels.length - 1;
    }
    setLogLevel(level);
}
