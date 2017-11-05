import { helper } from '../../decorators';
import { CommandConfig, HelperOptionsConfig, OptionConfig } from '../../interfaces';
import { CliExecuteCommandParsedEvent, CliExecuteCommandParseEvent, CliStartEvent } from '../../core/events';

import { SubCommandsGetFunction } from '../../utils/functions';
import { container, inject } from '../../core/Container';
import { Dispatcher } from '../../core/Dispatcher';
import { Config } from '../../core/config';
import { completion, Completion } from './Completion';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

//

@helper('completion', {
    singleton: true,
    config   : {
        name  : 'radical-console',
        option: {
            enabled: true,
            key    : 'O',
            name   : 'completion'
        }
    },
    listeners: {
        'cli:start'         : 'onStart',
        'cli:execute:parse' : 'onExecuteCommandParse',
        'cli:execute:parsed': 'onExecuteCommandParsed'
    }
})
export class CompletionHelper {
    config: HelperOptionsConfig;

    @inject('cli.events')
    events: Dispatcher

    @inject('cli.config')
    cliConfig: Config

    globalOptions: string[]

    completion: Completion

    protected get getSubCommands(): SubCommandsGetFunction { return container.get<SubCommandsGetFunction>('cli.fn.commands.get') }

    public onActivation() {
        this.completion = completion(this.config.name);
    }

    public onStart(event: CliStartEvent) {
        if ( process.argv.includes('--compgen') ) {
            // because we add this listener @ onStart event, the other helpers (which might add global options) are already started
            // Other listeners that use `cli:execute:parse` to add globals have already been added
            this.events.once('cli:execute:parse', (event) => {
                let globalOptions = this.cliConfig.get<OptionConfig[]>('globalOptions', []);

                this.globalOptions =
                    globalOptions
                        .filter(opt => opt.name.length !== 0)
                        .map((opt) => '--' + opt.name)
                        .concat(
                            globalOptions
                                .filter(opt => opt.key.length !== 0)
                                .map((opt) => '-' + opt.key)
                        )


                let tree = this.getGroup(event.cli.rootCommand);
                writeFileSync(resolve('debug.log'), JSON.stringify(tree, null, 4), 'utf-8')
                this.completion.tree(tree).init()
            })
        }
    }

    public onExecuteCommandParse(event: CliExecuteCommandParseEvent) {

        if ( this.config.option.enabled ) {
            event.cli.rootCommand.options.push({
                key        : this.config.option.key,
                name       : this.config.option.name,
                description: 'Generate completion code for current SHELL',
                type       : 'boolean'
            })
        }
    }

    public onExecuteCommandParsed(event: CliExecuteCommandParsedEvent) {
        if ( this.config.option.enabled && event.cli.rootCommand.cls === event.config.cls && event.argv[ this.config.option.key ] ) {
            console.log(this.completion.generateCompletionCode())
            process.exit()
        }
    }

    protected getGroup(config: CommandConfig) {
        let tree = {}

        this.getSubCommands<CommandConfig[]>(config.filePath, false, true).forEach((command) => {
            if ( command.isGroup ) {
                tree[ command.name ] = this.getGroup(command)
            } else {
                tree[ command.name ] = this.getCommand(command)
            }
            if(command.alias){
                tree[ command.alias ] = tree[ command.name ]
            }
        });
        if(config.isGroup){
            // this.getCommand(config).forEach(opt => tree[ opt ] = {})
        }

        return tree;
    }

    protected getCommand(config: CommandConfig) {
        let command = [].concat(this.globalOptions);
        if ( config.options && config.options.length > 0 ) {
            command = command
                .concat(
                    config.options
                        .filter(opt => opt.name.length !== 0)
                        .map(opt => '--' + opt.name)
                )
                .concat(
                    config.options
                        .filter(opt => opt.key.length !== 0)
                        .map(opt => '-' + opt.key)
                )
        }
        return command;
    }

}