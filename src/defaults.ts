import { CliConfig, CommandArgumentConfig, CommandConfig, HelperOptions, HelperOptionsConfig, OptionConfig } from './interfaces';
import { ConstructorOptions as EventsConstructorOptions } from 'eventemitter2';
import { cloneDeep } from 'lodash';
import { container } from './core/Container';
import { Config } from './core/config';

export const defaults = {
    config(): CliConfig {
        return <CliConfig> cloneDeep({
            mode          : 'require',
            autoExecute   : true,
            prettyErrors  : true,
            commands      : {
                onMissingArgument: 'fail'
            },
            log           : {
                useLevelIcons: false,
                level        : 'debug',
                colorize     : true,
                prettyPrint  : true,
                showLevel    : true
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
                    'boolean-negation'         : false,
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
        return <T> cloneDeep(<T>{
            alwaysRun        : null,
            name             : cls.name.replace('Command', '').toLowerCase(),
            alias            : null,
            usage            : null,
            description      : '',
            explanation      : null,
            isGroup          : false,
            enabled          : true,
            group            : null,
            example          : null,
            action           : 'handle',
            onMissingArgument: config.get('commands.onMissingArgument', 'fail'),
            arguments        : [],
            subCommands      : [],
            options          : [],
            helpers          : {},
            // argv       : process.argv,
            argv             : [],//process.argv.slice(2),
            cls
        });
    },
    option(cls: Object, key: string): OptionConfig {
        return <OptionConfig> cloneDeep({
            key      : '',
            name     : '',
            type     : null,
            arguments: 0,
            cls
        });
    },
    events(): EventsConstructorOptions {
        return <EventsConstructorOptions> cloneDeep({
            wildcard    : true,
            delimiter   : ':',
            newListener : true,
            maxListeners: 200
        })
    },
    argument(index: number): CommandArgumentConfig {
        return <CommandArgumentConfig> cloneDeep({
            position   : index,
            name       : null,
            description: '',
            alias      : null,
            type       : 'string',
            required   : false,
            variadic   : false,
            default    : null
        });
    },
    helper<T extends HelperOptionsConfig>(): HelperOptions<T> {
        return <HelperOptions<T>> cloneDeep({
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