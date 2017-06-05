import { CliConfig, CommandConfig, OptionConfig } from "./interfaces";
import { ConstructorOptions as EventsConstructorOptions } from "eventemitter2";
export const defaults = {
    config(): CliConfig {
        return <CliConfig> {
            mode          : "require",
            autoExecute   : true,
            prettyErrors  : true,
            log           : {
                level      : 'debug',
                colorize   : true,
                prettyPrint: true,
                showLevel  : true
            },
            globalOptions : [],
            enabledHelpers: [],
            text          : {},
            parser        : {
                yargs    : {
                    'short-option-groups'      : true,
                    'camel-case-expansion'     : true,
                    'dot-notation'             : true,
                    'parse-numbers'            : true,
                    'boolean-negation'         : true,
                    'duplicate-arguments-array': true,
                    'flatten-duplicate-arrays' : true
                },
                arguments: {
                    nullUndefined          : true,
                    undefinedBooleanIsFalse: true
                },
                options  : {}
            },
            router        : {},
            helpers       : {}
        }
    },
    command<T extends CommandConfig = CommandConfig>(cls: Function): T {
        return <T> {
            name       : cls.name.replace('Command', '').toLowerCase(),
            usage      : null,
            description: '',
            example    : null,
            action     : 'handle',
            arguments  : [],
            subCommands: [],
            // argv       : process.argv,
            args       : process.argv.slice(2),
            cls
        };
    },
    option(cls: Object, key: string): OptionConfig{
        return <OptionConfig> {
            key      : '',
            name     : '',
            type     : null,
            arguments: 0,
            cls
        };
    },
    events(): EventsConstructorOptions{
        return <EventsConstructorOptions> {
            wildcard    : true,
            delimiter   : ':',
            newListener : true,
            maxListeners: 200,

        }
    }
}