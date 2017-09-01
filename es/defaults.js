import { cloneDeep } from "lodash";
import { container } from "./core/Container";
export var defaults = {
    config: function () {
        return cloneDeep({
            mode: "require",
            autoExecute: true,
            prettyErrors: true,
            commands: {
                onMissingArgument: 'fail'
            },
            log: {
                level: 'debug',
                colorize: true,
                prettyPrint: true,
                showLevel: true
            },
            globalOptions: [],
            enabledHelpers: [],
            text: {},
            parser: {
                yargs: {
                    'short-option-groups': true,
                    'camel-case-expansion': true,
                    'dot-notation': true,
                    'parse-numbers': true,
                    'boolean-negation': false,
                    'duplicate-arguments-array': true,
                    'flatten-duplicate-arrays': true
                },
                arguments: {
                    nullUndefined: true,
                    undefinedBooleanIsFalse: true
                },
                options: {}
            },
            helpers: {}
        });
    },
    command: function (cls) {
        var config = container.get('cli.config');
        return cloneDeep({
            alwaysRun: null,
            name: cls.name.replace('Command', '').toLowerCase(),
            alias: null,
            usage: null,
            description: '',
            explanation: null,
            isGroup: false,
            enabled: true,
            group: null,
            example: null,
            action: 'handle',
            onMissingArgument: config.get('commands.onMissingArgument', 'fail'),
            arguments: [],
            subCommands: [],
            options: [],
            helpers: {},
            // argv       : process.argv,
            argv: [],
            cls: cls
        });
    },
    option: function (cls, key) {
        return cloneDeep({
            key: '',
            name: '',
            type: null,
            arguments: 0,
            cls: cls
        });
    },
    events: function () {
        return cloneDeep({
            wildcard: true,
            delimiter: ':',
            newListener: true,
            maxListeners: 200,
        });
    },
    argument: function (index) {
        return cloneDeep({
            position: index,
            name: null,
            description: '',
            alias: null,
            type: 'string',
            required: false,
            variadic: false,
            default: null
        });
    },
    helper: function () {
        return cloneDeep({
            name: null,
            cls: null,
            singleton: false,
            enabled: false,
            listeners: {},
            configKey: 'config',
            config: {},
            depends: [],
            enableDepends: true,
            binding: null,
            bindings: {}
        });
    }
};
