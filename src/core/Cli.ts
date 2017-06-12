import { kindOf } from "@radic/util";
import { container, inject, injectable, lazyInject } from "./Container";
import { CommandConfig, HelperOptions, HelperOptionsConfig, OptionConfig, ParsedCommandArguments } from "../interfaces";
import { ChildProcess } from "child_process";
import { YargsParserArgv } from "../../types/yargs-parser";
import * as _ from "lodash";
import { Events } from "./Events";
import { Log, log } from "./log";
import { Config } from "./config";
import { findSubCommandFilePath, parseArguments, prepareArguments, transformOptions } from "../utils";
import { resolve } from "path";
import { HaltEvent } from "./Event";
import { interfaces } from "inversify";
import { defaults } from "../defaults";
import Context = interfaces.Context;
import BindingWhenOnSyntax = interfaces.BindingWhenOnSyntax;
const parser = require('yargs-parser')
const get    = Reflect.getMetadata
declare var v8debug;
log.silly('go cli')


export class CliParseEvent extends HaltEvent {
    constructor(public config: CommandConfig, public globals: OptionConfig[]) {
        super('cli:parse')
    }
}
export class CliParsedEvent extends HaltEvent {
    constructor(public config: CommandConfig, public argv: YargsParserArgv, public globals: OptionConfig[]) {
        super('cli:parsed')
    }
}
export class CliSpawnEvent extends HaltEvent {
    constructor(public args: string[], public file: string, public proc: ChildProcess) {
        super('cli:spawn')
    }
}
export class CliExecuteCommandParseEvent extends HaltEvent {
    constructor(public config: CommandConfig, public options: OptionConfig[]) {
        super('cli:execute:parse')
    }
}
export class CliExecuteCommandParsedEvent extends HaltEvent {
    constructor(public argv: YargsParserArgv, public config: CommandConfig, public options: OptionConfig[]) {
        super('cli:execute:parsed')
    }
}
export class CliExecuteCommandInvalidArguments<T = any> extends HaltEvent {
    constructor(public instance: T,
                public parsed: ParsedCommandArguments,
                public config: CommandConfig,
                public options: OptionConfig[]) {
        super('cli:execute:invalid')
    }
}
export class CliExecuteCommandHandleEvent<T = any> extends HaltEvent {
    constructor(public instance: T,
                public parsed: ParsedCommandArguments,
                public argv: YargsParserArgv,
                public config: CommandConfig,
                public options: OptionConfig[]) {
        super('cli:execute:handle')
    }
}
export class CliExecuteCommandHandledEvent<T = any> extends HaltEvent {
    constructor(public result: any,
                public instance: T,
                public argv: YargsParserArgv,
                public config: CommandConfig,
                public options: OptionConfig[]) {
        super('cli:execute:handled')
    }
}
export type CliMode = 'require' | 'spawn'

// @singleton('cli')
@injectable()
export class Cli {
    protected _runningCommand: ChildProcess | CommandConfig;
    protected _helpers: { [name: string]: HelperOptions } = {}
    protected _requiredCommands: any[]                    = []
    protected _parsedCommands: CommandConfig[]            = []
    protected _rootCommand: CommandConfig;
    protected globalOptions: OptionConfig[]               = [];
    protected _startedHelpers: Array<string>              = []
    protected _mode: CliMode                              = 'require';

    @inject('cli.events')
    public events: Events;

    @lazyInject('cli.log')
    protected _log: Log;

    @lazyInject('cli.config')
    protected _config: Config;


    public get log(): Log { return this._log; }

    public get config(): Config { return this._config; }

    public get runningCommand(): CommandConfig {
        return <CommandConfig> this._runningCommand;
    }

    public get rootCommand(): CommandConfig {
        return <CommandConfig> this._rootCommand;
    }

    public get parsedCommands(): CommandConfig[] {
        return <CommandConfig[]> this._parsedCommands;
    }

    public start(requirePath: string): this {
        requirePath = resolve(requirePath);
        this._requiredCommands.push(requirePath.endsWith('.js') ? requirePath : requirePath + '.js');
        require(requirePath)
        return this
    }

    public parse(config: CommandConfig): this {

        if ( ! this._rootCommand ) {
            this._rootCommand = config;
        }

        this.events.fire(new CliParseEvent(config, this.globalOptions))

        let transformedOptions = transformOptions(this.globalOptions);
        let result             = parser(config.args, transformedOptions) as YargsParserArgv;

        this.events.fire(new CliParsedEvent(config, result, this.globalOptions))

        this._parsedCommands.push(config);

        // Check if sub-command should be invoked

        if ( ! this._runningCommand &&
            result._.length > 0 &&
            config.subCommands.length > 0 &&
            config.subCommands.includes(result._[ 0 ]) ) {

            let filePath = findSubCommandFilePath(result._[ 0 ], config.filePath)
            this._requiredCommands.push(filePath);
            if ( config.alwaysRun ) {
                this.executeCommand(config, true);
            }
            if ( this._mode === 'require' ) {
                return this.handleRequire(filePath, config);
            }
            throw new Error(`Invalid mode [${this._mode}]. Use 'spawn' or 'require' instead.`)
        }

        // for spawn mode, we'd check if there's no running command which means this is the actual command to execute
        // for require mode, the if statement will always pass
        if ( ! this._runningCommand ) {
            this._runningCommand = config;
            this.executeCommand(config);
        }

        return this;
    }

    protected handleRequire(filePath: string, config: CommandConfig): this {
        // remove the sub-command argument from the argv array, so the next time parse() is called, we dont get in weird results
        process.argv.splice(0, 1);

        const module = require(filePath);

        // this._requiredCommands.push(module);

        return this;
    }

    protected executeCommand(config: CommandConfig, isAlwaysRun: boolean = false) {


        this.startHelpers(config.helpers);

        let optionConfigs: OptionConfig[] = get('options', config.cls.prototype) || [];

        // Parse
        if ( ! isAlwaysRun )
            this.events.fire(new CliExecuteCommandParseEvent(config, optionConfigs))

        let transformedOptions = transformOptions(optionConfigs.concat(this.globalOptions));
        let argv               = parser(config.args, transformedOptions) as YargsParserArgv;

        if ( ! isAlwaysRun )
            this.events.fire(new CliExecuteCommandParsedEvent(argv, config, optionConfigs))

        // Create
        if ( kindOf(config.action) === 'function' ) {
            config.cls.prototype[ 'handle' ] = config.action
        }

        let instance = container.resolve(<any> config.cls);

        // Assign the config itself to the instance, so it's possible to check back on it
        instance[ '_config' ]  = config;
        instance[ '_options' ] = optionConfigs;

        // Argument assignment to the instance
        _.without(Object.keys(argv), '_').forEach((argName: string, argIndex: number) => {
            instance[ argName ] = argv[ argName ];
        })


        // Handle
        if ( isAlwaysRun && instance[ 'always' ] ) {
            return instance[ 'always' ].apply(instance, [ argv ]);
        }

        let parsed = parseArguments(argv._, config.arguments)
        this.events.fire(new CliExecuteCommandHandleEvent(instance, parsed, argv, config, optionConfigs))

        // if any missing, execute the way we should handle the arguments.
        if ( ! parsed.valid ) {
            this.events.fire(new CliExecuteCommandInvalidArguments(instance, parsed, config, optionConfigs));
            if ( config.onMissingArgument === "fail" ) {
                this.fail(`Missing required argument [${parsed.missing.shift()}]`);
            }
            if ( config.onMissingArgument === "handle" ) {
                if ( kindOf(instance[ 'handleInvalid' ]) ) {
                    let result = instance[ 'handleInvalid' ].apply(instance, [ parsed, argv ])
                    if ( result === false ) {
                        process.exit(1);
                    }
                }
            }
        }
        let result = instance[ 'handle' ].apply(instance, [ parsed.arguments, argv ]);

        this.events.fire(new CliExecuteCommandHandledEvent(result, instance, argv, config, optionConfigs))

        if ( result === false ) {
            process.exit(1);
        }


    }

    public helper(name: string, config?: HelperOptionsConfig): this {
        this.enableHelper(name, config)
        return this;
    }

    public helpers(...names: string[]): this {
        names.forEach(name => this.helper(name));
        return this
    }

    public addHelper<T>(options: HelperOptions): HelperOptions {
        // merge default options
        const def = defaults.helper()
        options   = _.merge({}, def, options);

        // set the helper config in the global config, so it can be overridden
        this.config.set('helpers.' + options.name, options.config);


        return this._helpers[ options.name ] = options;
    }

    protected enableHelper(name: string, customConfig: HelperOptionsConfig = {}) {
        let options = this._helpers[ name ];
        this.config.merge(`helpers.${name}`, customConfig);
        options.enabled    = true;
        let enabledHelpers = <string[]> this.config.get('enabledHelpers', []);
        enabledHelpers.push(name)
        this.config.set('enabledHelpers', enabledHelpers);

    }

    protected startHelpers(customConfigs: { [name: string]: HelperOptionsConfig } = {}) {
        this.config.get<string[]>('enabledHelpers', []).forEach(name => {
            this.startHelper(name, customConfigs[ name ] || {});
        })
    }

    /** some helpers can/need to be enabled before usage **/
    protected startHelper(name: string, customConfig: HelperOptionsConfig = {}) {
        let options = this._helpers[ name ];
        if ( this._runningCommand && this._startedHelpers.includes(name) ) {
            // when resolving, get the (possibly overridden) config and add it to the helper
            options.binding.onActivation((ctx: Context, helperClass: Function): any => {
                // console.dir(ctx.plan, {depth: 50, colors: true }); //.plan.rootRequest.serviceIdentifier
                // process.exit();
                helperClass[ options.configKey ] = _.merge(this.config('helpers.' + options.name), customConfig);
                return helperClass
            });
        }
        if ( this._startedHelpers.includes(name) ) {
            return;
        }

        this._startedHelpers.push(name);


        // start dependency helpers
        if ( options.depends.length > 0 ) {
            options.depends.forEach(depend => {
                if ( ! Object.keys(this._helpers).includes(depend) ) {
                    if ( ! options.enableDepends ) {
                        throw new Error(`Cannot start helper [${name}]. It depends on [${depend}]. Either enable it or set config [helpers.${name}.enableDepends] to [true]`);
                    }
                    this.startHelper(depend);
                }
            })
        }

        let bindingName = 'cli.helpers.' + options.name;
        // bind the helper into the container, if needed as singleton
        // if ( container.isBound(bindingName) ) {
        container.ensureInjectable(options.cls);
        options.binding = container.bind(bindingName).to(options.cls);
        if ( options.singleton ) {
            options.binding.inSingletonScope()
        }
        options.binding.onActivation((ctx: Context, helperClass: Function): any => {
            // console.dir(ctx.plan, {depth: 50, colors: true }); //.plan.rootRequest.serviceIdentifier
            // process.exit();
            helperClass[ options.configKey ] = this.config('helpers.' + options.name);
            return helperClass
        });

        let instance;
        // add the event listeners and bind them to the given function names
        // if ( container.isBound(bindingName) ) {
        //     return;
        // }
        Object.keys(options.listeners).forEach(eventName => {
            let fnName = options.listeners[ eventName ];

            this.events.once(eventName, (...args: any[]) => {
                instance = instance || container.get(bindingName);
                if ( kindOf(instance[ fnName ]) === 'function' ) {
                    instance[ fnName ].apply(instance, args);
                }
            })
        })
        this._helpers[ name ] = options;
    }


    public fail(msg?: string) {
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

    public globals(configs: OptionConfig[] | { [key: string]: OptionConfig }): this {
        if ( kindOf(configs) === 'object' ) {
            Object.keys(configs).forEach(key => this.global(key, configs[ key ]))
            return this;
        }
        (<OptionConfig[]> configs).forEach(config => this.global(config));
        return this;
    }
}
export const cli: Cli = container.resolve<Cli>(Cli);
container.constant('cli', cli);
// container.constant('cli', cli)