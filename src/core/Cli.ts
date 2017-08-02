import { kindOf } from "@radic/util";
import { container, injectable, lazyInject } from "./Container";
import { BasePluginConfig, CommandConfig, HelperOptionsConfig, OptionConfig, Plugin } from "../interfaces";
// import { YargsParserArgv } from "../../types/yargs-parser";
import { CliExecuteCommandEvent, CliExecuteCommandHandledEvent, CliExecuteCommandHandleEvent, CliExecuteCommandInvalidArgumentsEvent, CliExecuteCommandParsedEvent, CliExecuteCommandParseEvent, CliParsedEvent, CliParseEvent, CliStartEvent } from "./events";
import { Log } from "./Log";
import { Config } from "./config";
import { ParseArgumentsFunction, SubCommandsGetFunction, TransformOptionsFunction } from "../utils";
import { resolve } from "path";
import { interfaces } from "inversify";
import * as _ from "lodash";
import { Helpers } from "./Helpers";
import { Dispatcher } from "./Dispatcher";
import * as parser from "yargs-parser";
import Context = interfaces.Context;
import BindingWhenOnSyntax = interfaces.BindingWhenOnSyntax;
import Factory = interfaces.Factory;
// import { YargsParserArgv } from "../../types/yargs-parser";
// const parser = require('yargs-parser')
const get = Reflect.getMetadata
declare var v8debug;

// @singleton('cli')
@injectable()
export class Cli {
    protected _runningCommand: CommandConfig;
    protected _parsedCommands: CommandConfig[] = []
    protected _rootCommand: CommandConfig;
    protected globalOptions: OptionConfig[]    = [];

    public get runningCommand(): CommandConfig { return <CommandConfig> this._runningCommand; }

    public get rootCommand(): CommandConfig { return <CommandConfig> this._rootCommand; }

    public get parsedCommands(): CommandConfig[] { return <CommandConfig[]> this._parsedCommands; }

    public parseCommands: boolean = true;

    @lazyInject('cli.helpers')
    public helpers: Helpers;

    @lazyInject('cli.events')
    public events: Dispatcher;

    @lazyInject('cli.log')
    public log: Log;

    @lazyInject('cli.config')
    public config: Config;

    public get transformOptions(): TransformOptionsFunction { return container.get<TransformOptionsFunction>('cli.fn.options.transform') }

    public get parseArguments(): ParseArgumentsFunction { return container.get<ParseArgumentsFunction>('cli.fn.arguments.parse') }

    public get getSubCommands(): SubCommandsGetFunction { return container.get<SubCommandsGetFunction>('cli.fn.commands.get') }

    public start(requirePath: string): this {

        requirePath = resolve(requirePath);
        this.events.fire(new CliStartEvent(requirePath)).proceed(() => require(requirePath))
        return this
    }

    public parse(config: CommandConfig): this {

        if ( ! this.parseCommands ) {
            return;
        }
        let isRootCommand : boolean = ! this._rootCommand
        if ( isRootCommand ) {
            this._rootCommand = config;
        }

        if(this.events.fire(new CliParseEvent(config, this.globalOptions, isRootCommand)).stopIfExit().isCanceled()) return

        let transformedOptions           = this.transformOptions(this.globalOptions);
        transformedOptions.configuration = this.config('parser.yargs')
        let result                       = parser(config.args, transformedOptions) as YargsParserArgv;
        this.events.fire(new CliParsedEvent(config, this.globalOptions, isRootCommand, result)).stopIfExit()
        this._parsedCommands.push(config);

        if ( ! this._runningCommand && result._.length > 0 && config.isGroup ) {
            if ( config.alwaysRun ) {
                this.events.fire(new CliExecuteCommandEvent(config, config.alwaysRun)).proceed(() => this.executeCommand(config));
            }
            const subCommands = this.getSubCommands(config.filePath)
            if ( subCommands[ result._[ 0 ] ] ) {
                const command: CommandConfig = subCommands[ result._[ 0 ] ];
                command.args.shift();
                process.argv.shift();
                this.parse(command);
                return this
            }
        }
        if ( ! this._runningCommand ) {
            this._runningCommand = config;
            this.events.fire(new CliExecuteCommandEvent(config, config.alwaysRun)).proceed(() => this.executeCommand(config));
        }

        return this;
    }


    protected async executeCommand(config: CommandConfig) {
        this.helpers.startHelpers(config.helpers);

        let optionConfigs: OptionConfig[] = get('options', config.cls.prototype) || [];

        // Parse
        if ( ! config.alwaysRun )
            this.events.fire(new CliExecuteCommandParseEvent(config, optionConfigs))

        let transformedOptions           = this.transformOptions(this.globalOptions.concat(optionConfigs));
        transformedOptions.configuration = this.config('parser.yargs')
        let argv                         = parser(config.args, transformedOptions) as YargsParserArgv;

        if ( ! config.alwaysRun )
            this.events.fire(new CliExecuteCommandParsedEvent(argv, config, optionConfigs))

        // Create
        if ( kindOf(config.action) === 'function' ) {
            config.cls.prototype[ 'handle' ] = config.action
        }

        let instance = container.resolve(<any> config.cls);

        // Assign the config itself to the instance, so it's possible to check back on it
        instance[ '_config' ]  = config;
        instance[ '_options' ] = optionConfigs;


        // the 'always run' doesn't pass this point
        if ( config.alwaysRun && kindOf(instance[ config.alwaysRun ]) === 'function' ) {
            return instance[ config.alwaysRun ].apply(instance, [ argv ]);
        }

        // Argument assignment to the instance
        // Object.assign(instance, _.without(Object.keys(argv), '_'))
        _.without(Object.keys(argv), '_').forEach((argName: string, argIndex: number) => {
            instance[ argName ] = argv[ argName ];
        })

        let parsed = this.parseArguments(argv._, config.arguments)
        this.events.fire(new CliExecuteCommandHandleEvent(instance, parsed, argv, config, optionConfigs))

        // if any missing, execute the way we should handle the arguments.
        if ( ! parsed.valid ) {
            this.events.fire(new CliExecuteCommandInvalidArgumentsEvent(instance, parsed, config, optionConfigs));
            if ( config.onMissingArgument === "fail" ) {
                this.fail(`Missing required argument [${parsed.missing.shift()}]`);
            }
            if ( config.onMissingArgument === "handle" ) {
                if ( kindOf(instance[ 'handleInvalid' ]) === 'function' ) {
                    let result = instance[ 'handleInvalid' ].apply(instance, [ parsed, argv ])
                    if ( result === false ) {
                        this.log.error('Not enough arguments given, use the -h / --help option for more information')
                        process.exit(1);
                    }
                }
            }
        }

        // give a way to validate / format arguments. We'll pass em to the method (if exist)
        if ( kindOf(instance[ 'validate' ]) === 'function' ) {
            // if it returns a string, its a failed validation string.
            let validate = instance[ 'validate' ].apply(instance, [ parsed.arguments, argv ])
            if ( kindOf(validate) === 'string' ) {
                this.fail(validate)
            }
            // If it returns an object, assume its formatted arguments, so we assign em to the eventually passed arguments
            if ( kindOf(validate) === 'object' ) {
                parsed.arguments = validate;
            }
        }

        let result = instance[ 'handle' ].apply(instance, [ parsed.arguments, argv ]);

        this.events.fire(new CliExecuteCommandHandledEvent(result, instance, argv, config, optionConfigs))

        if ( result === null || result === undefined ) process.exit();

        if ( result === true ) process.exit();

        if ( result[ 'then' ] !== undefined ) {
            result = await result.then((res) => {
                return Promise.resolve(true)
            }).catch(err => {
                this.log.error(err)
                throw new Error(err);
            });
        }

        process.exit(1);
    }

    public helper(name: string, config ?: HelperOptionsConfig): this {
        this.helpers.enableHelper(name, config)
        return this;
    }

    //
    // public helpers(...names: string[]): this {
    //     names.forEach(name => this.helper(name));
    //     return this
    // }

    public fail(msg ?: string) {
        if ( msg ) {
            this.log.error(msg);
        }
        process.exit(1);
    }

    public global(key: string, config: OptionConfig): this
    public global(config: OptionConfig): this
    public global(...args: any[]): this {
        let config: OptionConfig;
        if ( args.length === 1 ) {
            config = args[ 0 ];
        } else if ( args.length === 2 ) {
            config     = args[ 1 ];
            config.key = args[ 0 ];
        }
        this.globalOptions.push(config);
        let globalOptions: OptionConfig[] = this.config.get<OptionConfig[]>('globalOptions');
        globalOptions.push(config);
        this.config.set('globalOptions', globalOptions);
        return this;
    }

    public globals(configs: OptionConfig[ ] | { [key: string]: OptionConfig }): this {
        if ( kindOf(configs) === 'object' ) {
            Object.keys(configs).forEach(key => this.global(key, configs[ key ]))
            return this;
        }
        (<OptionConfig[]> configs).forEach(config => this.global(config));
        return this;
    }

    public use<T extends BasePluginConfig>(plugin: Plugin<T>) {

    }
}

container.constant('cli', new Cli);
export const cli: Cli = container.get<Cli>('cli');

// container.constant('cli', cli)