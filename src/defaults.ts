import { CliConfig, CommandArgumentConfig, CommandConfig, HelperOptions, OptionConfig } from "./interfaces";
import { ConstructorOptions as EventsConstructorOptions } from "eventemitter2";
import { cloneDeep } from "lodash";
import { container } from "./core/Container";
import { Config } from "./core/config";
export const defaults = {
    config(): CliConfig {
        return <CliConfig> cloneDeep({
            mode          : "require",
            autoExecute   : true,
            prettyErrors  : true,
            commands      : {
                onMissingArgument: 'fail'
            },
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
            helpers       : {}
        })
    },
    command<T extends CommandConfig = CommandConfig>(cls: Function): T {
        let config = container.get<Config>('cli.config');
        return <T> cloneDeep({
            alwaysRun        : false,
            name             : cls.name.replace('Command', '').toLowerCase(),
            alias            : null,
            usage            : null,
            description      : '',
            explenation      : '',
            isGroup          : false,
            enabled          : true,
            group            : null,
            example          : null,
            action           : 'handle',
            onMissingArgument: config.get('commands.onMissingArgument', 'fail'),
            arguments        : [],
            subCommands      : [],
            helpers          : {},
            // argv       : process.argv,
            args             : process.argv.slice(2),
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
    },
    helper(): HelperOptions {
        return <HelperOptions> cloneDeep({
            name         : null,
            cls          : null,
            singleton    : false,
            enabled      : false,
            listeners    : {},
            configKey    : 'config',
            config       : {},
            depends      : [],
            enableDepends: true,
            binding      : null,
            bindings     : {}
        })
    }
}