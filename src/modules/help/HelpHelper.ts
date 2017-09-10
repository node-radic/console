import * as _ from 'lodash';
import { kindOf } from '@radic/util';

import { CommandConfig, HelpHelperOptionsConfig, OptionConfig } from '../../interfaces';
import { HelpHelperOnInvalidArgumentsShowHelpEvent, HelpHelperShowHelpEvent } from './events';

import { helper } from '../../decorators';
import { SubCommandsGetFunction } from '../../utils';

import { Cli, CliExecuteCommandHandleEvent, CliExecuteCommandInvalidArgumentsEvent, CliExecuteCommandParseEvent, container, Dispatcher, inject, Log } from '../../core';
import { OutputHelper } from '../output/OutputHelper';
import { CommandDescriber } from './CommandDescriber';

@helper('help', {
    config   : {
        app               : {
            title: ''
        },
        addShowHelpCommand: true,
        showOnError       : true,
        option            : {
            enabled: false,
            key    : 'h',
            name   : 'help'
        },
        style             : {
            titleLines : 'darkorange',
            header     : 'darkorange bold',
            group      : 'darkcyan bold',
            grouped    : 'darkcyan bold',
            command    : 'steelblue',
            required   : 'green',
            description: 'darkslategray',
            desc       : '<%= helpers.help.style.description %>', // alias
            argument   : 'yellow darken 25',
            optional   : 'yellow darken 30',
            array      : 'cyan',
            type       : 'yellow'
        },
        templates         : {
            usage   : '{header}Usage:{/header}',
            treeItem: (config: CommandConfig, optionConfigs: OptionConfig[]) => `${config.name} ${config.arguments.map(arg => {
                let name = arg.name;

                return arg.required ? `<{argument}${name}{/argument}>` : `[{optional}${name}{/optional}]`

            }).join(' ')}`
        },
        order             : [
            'usage',
            'description',
            'explanation',
            'groups',
            'commands',
            'arguments',
            'options',
            'globalOptions',
            'example'
        ],
        headers           : {
            usage        : '{header}Usage: {/header}',
            description  : '{header}Description: {/header}\n',
            explanation  : '{header}Explanation: {/header}\n',
            groups       : '{header}Groups: {/header}\n',
            commands     : '{header}Commands: {/header}\n',
            arguments    : '{header}Arguments: {/header}\n',
            options      : '{header}Options: {/header}\n',
            globalOptions: '{header}Global options: {/header}\n',
            example      : '{header}Example: {/header}\n'
        },
        overrides         : {
            usage        : null,
            description  : null,
            explanation  : null,
            groups       : null,
            commands     : null,
            arguments    : null,
            options      : null,
            globalOptions: null,
            example      : null
        },
        display           : {
            title             : true,
            titleLines        : true,
            explanation       : true,
            description       : true,
            descriptionAsTitle: false,
            usage             : true,
            usageOnGroups     : false,
            example           : true,
            arguments         : true,
            options           : true,
            globalOptions     : true,
            commands          : true,
            groups            : true
        }
    },
    listeners: {
        'cli:execute:parse'  : 'onCommandParse',
        'cli:execute:handle' : 'onCommandHandle',
        'cli:execute:invalid': 'onInvalidArguments'
    },
    depends  : [ 'output' ]
})
export class HelpHelper {
    config: HelpHelperOptionsConfig;

    @inject('cli.events')
    events: Dispatcher

    @inject('cli')
    cli: Cli

    @inject('cli.log')
    log: Log

    @inject('cli.helpers.output')
    out: OutputHelper;

    public get getSubCommands(): SubCommandsGetFunction { return container.get<SubCommandsGetFunction>('cli.fn.commands.get') }

    public createDescriber(command: CommandConfig): CommandDescriber {
        let describer     = container.get<CommandDescriber>('cli.helpers.help.describer')
        describer.command = command;
        return describer;
    }

    public showHelp(config: CommandConfig, options: OptionConfig[]) {
        if ( config.helpers[ 'help' ] ) {
            _.merge(this.config, config.helpers[ 'help' ]);
        }
        this.events.fire(new HelpHelperShowHelpEvent(config, options))
        let describer = this.createDescriber(config)
        this.config.order.forEach((item, i) => {
            if ( kindOf(this.config.overrides[ item ]) === 'function' ) {
                return this.config.overrides[ item ](config, describer, this);
            }
            describer[ item ]()
        })
    }

    public onCommandParse(event: CliExecuteCommandParseEvent) {
        if ( this.config.option.enabled === true ) {
            event.cli.global(this.config.option.key, {
                name       : this.config.option.name,
                type       : 'boolean',
                description: 'show help'
            })
        }

    }

    public onCommandHandle(event: CliExecuteCommandHandleEvent): void {
        if ( this.config.addShowHelpCommand ) {
            this.out.styles(this.config.style);
            event.instance[ 'showHelp' ] = () => {
                this.showHelp(event.config, event.options)
            };
            if ( event.argv[ this.config.option.key ] ) {
                this.events.emit('help:' + event.config.name)
                if ( kindOf(event.instance[ 'help' ]) === 'function' ) {
                    event.instance[ 'help' ].apply(event.instance, [ event.config, event.options ]);
                    return event.exit();
                }
                this.showHelp(event.config, event.options);
                return event.exit();
            }
        }
    }

    public onInvalidArguments(event: CliExecuteCommandInvalidArgumentsEvent) {
        if ( this.config.showOnError === true && event.config.onMissingArgument === 'help' ) {
            if ( this.events.fire(new HelpHelperOnInvalidArgumentsShowHelpEvent(event)).stopIfExit().isCanceled() ) return
            this.showHelp(event.config, event.options);
            this.out.nl;
            for ( let m in event.parsed.missing ) {
                this.log.error(`Missing required argument <${event.parsed.missing[ m ]}>`)
            }
            return event.exit();
        }
    }

}
