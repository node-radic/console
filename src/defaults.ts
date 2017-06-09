import { CliConfig, CommandArgumentConfig, CommandConfig, OptionConfig } from "./interfaces";
import { ConstructorOptions as EventsConstructorOptions } from "eventemitter2";
import { cloneDeep } from "lodash";
export const defaults = {
    config(): CliConfig {
        return <CliConfig> cloneDeep({
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
        })
    },
    command<T extends CommandConfig = CommandConfig>(cls: Function): T {
        return <T> cloneDeep({
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
        });
    },
    option(cls: Object, key: string): OptionConfig{
        return <OptionConfig> cloneDeep({
            key      : '',
            name     : '',
            type     : null,
            arguments: 0,
            cls
        });
    },
    events(): EventsConstructorOptions{
        return <EventsConstructorOptions> cloneDeep({
            wildcard    : true,
            delimiter   : ':',
            newListener : true,
            maxListeners: 200,
        })
    },
    argument(index: number): CommandArgumentConfig{
        return <CommandArgumentConfig> cloneDeep({
            position: index,
            name    : null,
            desc    : '',
            alias   : null,
            required: false,
            variadic: false,
        });
    }
}