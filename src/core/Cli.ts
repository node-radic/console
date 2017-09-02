import { kindOf } from "@radic/util";
import { container, injectable, lazyInject } from "./Container";
import {  HelpersOptionsConfig,CliConfig, CommandConfig, HelperOptionsConfig, OptionConfig } from "../interfaces";
// import { YargsParserArgv } from "../../types/yargs-parser";
import { CliExecuteCommandEvent, CliExecuteCommandHandledEvent, CliExecuteCommandHandleEvent, CliExecuteCommandInvalidArgumentsEvent,
    CliExecuteCommandParsedEvent, CliExecuteCommandParseEvent, CliParsedEvent, CliParseEvent, CliStartEvent } from "./events";
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
    protected _argv: string[]

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

    public configure(config: CliConfig): this {
        this.config.merge(config);
        return this;
    }

    public useArgv(argv: string[]): this {
        this._argv = argv;
        return this;
    }

    public get argv(): string[] {
        return this._argv || process.argv.slice(2);

    }

    public async start(requirePath: string) {
        process
            .on('unhandledRejection', (reason, p) => {
                console.error(reason, 'Unhandled sdfRejection at Promise', p);
            })
            .on('uncaughtException', err => {
                console.error(err, 'Uncaught Exceptifon thrown');
                process.exit(1);
            });
        requirePath = resolve(requirePath);
        this.events.fire(new CliStartEvent(requirePath)).proceed(() => {
            this.helpers.startHelpers();
            let mod      = require(requirePath)
            let command  = <CommandConfig> Reflect.getMetadata('command', mod.default);
            command.argv = this.argv;
            return this.parse(command)
        })
        return Promise.resolve()

    }

    public async parse(config: CommandConfig) {
        if ( kindOf(config.action) === 'function' ) {
            config.argv = this.argv;
            return this.executeCommand(config);
        }
        if ( ! this.parseCommands ) {
            return Promise.resolve()
        }
        let isRootCommand: boolean = ! this._rootCommand
        if ( isRootCommand ) {
            this._rootCommand = config;
        }

        if ( this.events.fire(new CliParseEvent(config, this.globalOptions, isRootCommand)).stopIfExit().isCanceled() ) return

        let transformedOptions           = this.transformOptions(this.globalOptions);
        transformedOptions.configuration = this.config('parser.yargs')
        let result                       = parser(config.argv, transformedOptions) as YargsParserArgv;
        this.events.fire(new CliParsedEvent(config, this.globalOptions, isRootCommand, result)).stopIfExit()
        this._parsedCommands.push(config);

        if ( config.alwaysRun ) {
            this.events.fire(new CliExecuteCommandEvent(config, config.alwaysRun)).proceed(() => {
                let instance = container.resolve(<any> config.cls);
                if ( kindOf(instance[ config.alwaysRun ]) === 'function' ) {
                    instance[ config.alwaysRun ].apply(instance, [ config.argv ]);
                    return Promise.resolve()
                }
            });
        }

        if ( ! this._runningCommand && result._.length > 0 && config.isGroup ) {
            const subCommands = this.getSubCommands(config.filePath)
            if ( subCommands[ result._[ 0 ] ] ) {
                const command: CommandConfig = subCommands[ result._[ 0 ] ];
                command.argv                 = config.argv.slice(1)
                // process.argv.shift();
                return this.parse(command);
            }
        }

        if ( ! this._runningCommand ) {
            this._runningCommand = config;
            if ( ! this.events.fire(new CliExecuteCommandEvent(config, config.alwaysRun)).isCanceled() ) {
                return this.executeCommand(config)
            }
        }

        return Promise.resolve();
    }


    protected async executeCommand(config: CommandConfig) {


        // let optionConfigs: OptionConfig[] = get('options', config.cls.prototype) || [];
        let optionConfigs: OptionConfig[] = config.options

        // Parse
        this.events.fire(new CliExecuteCommandParseEvent(config, optionConfigs))

        let transformedOptions           = this.transformOptions(this.globalOptions.concat(optionConfigs));
        transformedOptions.configuration = this.config('parser.yargs')
        let argv                         = parser(config.argv, transformedOptions) as YargsParserArgv;

        this.events.fire(new CliExecuteCommandParsedEvent(argv, config, optionConfigs))


        if ( kindOf(config.action) === 'function' ) {
            config.cls = function () {}
            container.ensureInjectable(config.cls);
            config.cls.prototype[ 'handle' ] = (<Function> config.action)
        }
        let instance = container.resolve(<any> config.cls);

        // Assign the config itself to the instance, so it's possible to check back on it
        instance[ '_config' ]  = config;
        instance[ '_options' ] = optionConfigs;

        // Argument assignment to the instance
        // Object.assign(instance, _.without(Object.keys(argv), '_'))
        _.without(Object.keys(argv), '_').forEach((argName: string, argIndex: number) => {
            instance[ argName ] = argv[ argName ];
        })

        let parsed = this.parseArguments(argv._, config.arguments)
        this.events.fire(new CliExecuteCommandHandleEvent(instance, parsed, argv, config, optionConfigs)).stopIfExit()

        // if any missing, execute the way we should handle the arguments.
        if ( ! parsed.valid ) {
            this.events.fire(new CliExecuteCommandInvalidArgumentsEvent(instance, parsed, config, optionConfigs)).stopIfExit();
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
            let md = Reflect.getMetadataKeys(instance[ 'validate' ]).map(key => Reflect.getMetadata(key, instance[ 'validate' ]))
            console.log(md)
            let validate = instance[ 'validate' ].apply(instance, [ parsed.arguments, argv ])
            // if it returns a string, its a failed validation string.
            if ( kindOf(validate) === 'string' ) {
                this.fail(validate)
            }
            // if it returns a function, it should be a promise with formatted arguments
            if ( kindOf(validate) === 'function' && kindOf(validate[ 'then' ]) === 'function' ) {
                console.log('await validate')

                parsed.arguments = await validate
            }
            // If it returns an object, assume its formatted arguments, so we assign em to the eventually passed arguments
            if ( kindOf(validate) === 'object' ) {
                parsed.arguments = validate;
            }
        }

        let result = instance[ 'handle' ].apply(instance, [ parsed.arguments, argv ]);

        this.events.fire(new CliExecuteCommandHandledEvent(result, instance, argv, config, optionConfigs)).stopIfExit()

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

    public helper<T extends keyof HelpersOptionsConfig>(name: T, config ?: HelpersOptionsConfig[T]): this {
        this.helpers.enable(name, config)
        return this;
    }

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

}

container.constant('cli', new Cli);
export const cli: Cli = container.get<Cli>('cli');

// container.constant('cli', cli)