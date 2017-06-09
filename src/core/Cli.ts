import { kindOf } from "@radic/util";
import { container, lazyInject } from "./Container";
import { CommandConfig, HelperOptions, HelperOptionsConfig, OptionConfig } from "../interfaces";
import { ChildProcess, fork, spawn } from "child_process";
import { YargsParserArgv } from "../../types/yargs-parser";
import * as _ from "lodash";
import { Events, HaltEvent } from "./Events";
import { Log, log } from "./log";
import { Config } from "./config";
import { findSubCommandFilePath, parseArguments, transformOptions } from "../utils";
import { resolve } from "path";
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
export class CliExecuteCommandHandleEvent<T = any> extends HaltEvent {
    constructor(public instance: T,
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
export class Cli {
    protected _runningCommand: ChildProcess | CommandConfig;
    protected _helpers: { [name: string]: HelperOptions } = {}
    protected _requiredCommands: any[]                    = []
    protected globalOptions: OptionConfig[]               = [];
    protected _startedHelpers: Array<string>              = []
    protected _mode: CliMode                              = 'require';

    @lazyInject('cli.events')
    protected _events: Events;

    @lazyInject('cli.log')
    protected _log: Log;

    @lazyInject('cli.config')
    protected _config: Config;


    public get events(): Events { return this._events; }

    public get log(): Log { return this._log; }

    public get config(): Config { return this._config; }

    public get runningCommand(): CommandConfig {
        return <CommandConfig> this._runningCommand;
    }

    public mode(mode: CliMode) : this {
        this._mode = mode;
        return this;
    }

    public start(requirePath: string) : this {
        requirePath = resolve(requirePath);
        this._requiredCommands.push(requirePath.endsWith('.js') ? requirePath : requirePath + '.js');
        require(requirePath)
        return this
    }

    public parse(config: CommandConfig): this {

        this.events.fire(new CliParseEvent(config, this.globalOptions))

        let transformedOptions = transformOptions(this.globalOptions);
        let result             = parser(config.args, transformedOptions) as YargsParserArgv;

        this.events.fire(new CliParsedEvent(config, result, this.globalOptions))

        // Check if sub-command should be invoked

        if ( result._.length > 0 &&
            config.subCommands.length > 0 &&
            config.subCommands.includes(result._[ 0 ]) ) {

            let filePath = findSubCommandFilePath(result._[ 0 ], config.filePath)
            this._requiredCommands.push(filePath);
            if ( config.alwaysRun ) {
                this.executeCommand(config, true);
            }

            if ( this._mode === 'spawn' ) {
                return this.handleSpawn(filePath, config);
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

    protected handleSpawn(filePath: string, config: CommandConfig): this {

        config.args.shift();

        config.args.unshift(filePath)
        let startOpts     = {};
        let isInDebugMode = typeof v8debug === 'object';
        if ( isInDebugMode ) {
            startOpts = { execArgv: [ '--debug-brk=' + Math.round(Math.random() * 10000) ] };
        }
        let proc: ChildProcess = fork(filePath, [].concat(config.args), startOpts)//, <any>{ execArgv: ['--debug-brk']}); //stdio: [0, 'ignore', 'ignore', 'ipc']
        this.events.fire(new CliSpawnEvent(config.args, filePath, proc))

        proc.send({ config: this.config.get() })
        proc.on('close', process.exit.bind(process));
        proc.on('error', function (err) {
            if ( err[ 'code' ] == "ENOENT" ) {
                console.error('\n  %s(1) does not exist, try --help\n', filePath);
            } else if ( err[ 'code' ] == "EACCES" ) {
                console.error('\n  %s(1) not executable. try chmod or run with root\n', filePath);
            }
            process.exit(1);
        });

        // Store the reference to the child process
        this._runningCommand = proc;

        return this;
    }

    protected executeCommand(config: CommandConfig, isAlwaysRun: boolean = false) {

        this.startHelpers();
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

        let instance = container.build(config.cls);

        _.without(Object.keys(argv), '_').forEach((argName: string, argIndex: number) => {
            instance[ argName ] = argv[ argName ];
        })

        let args = parseArguments(argv._, config.arguments)

        // Handle
        if ( ! isAlwaysRun )
            this.events.fire(new CliExecuteCommandHandleEvent(instance, argv, config, optionConfigs))

        let result: any
        if ( kindOf(instance[ isAlwaysRun ? 'always' : 'handle' ]) === 'function' ) {
            result = instance[ isAlwaysRun ? 'always' : 'handle' ].apply(instance, [ args, argv ]);
        }
        if ( ! isAlwaysRun )
            this.events.fire(new CliExecuteCommandHandledEvent(result, instance, argv, config, optionConfigs))

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
        const defaults = {
            name         : null,
            cls          : null,
            singleton    : false,
            enabled      : false,
            listeners    : {},
            configKey    : 'config',
            config       : {},
            depends      : [],
            enableDepends: true,
            bindings     : {}
        }
        options        = _.merge({}, defaults, options);

        // set the helper config in the global config, so it can be overridden
        this.config.set('helpers.' + options.name, options.config);
        this._helpers[ options.name ] = options;

        return options;
    }

    protected enableHelper(name: string, customConfig: HelperOptionsConfig = {}) {
        let options = this._helpers[ name ];
        this.config.merge(`helpers.${options.name}.config`, customConfig);
        this.config.set(`helpers.${options.name}.enabled`, true);
        let enabledHelpers = <string[]> this.config.get('enabledHelpers', []);
        enabledHelpers.push(name)
        this.config.set('enabledHelpers', enabledHelpers);

    }

    protected startHelpers() {
        this.config.get<string[]>('enabledHelpers', []).forEach(name => {
            this.startHelper(name);
        })
    }

    /** some helpers can/need to be enabled before usage **/
    protected startHelper(name: string, customConfig: HelperOptionsConfig = {}) {
        let options = this._helpers[ name ];
        if ( this._startedHelpers.includes(name) ) return;
        this._startedHelpers.push(name);

        // make sure not to singletons twice
        let bindingName = 'cli.helpers.' + options.name;
        // if ( options.singleton && container.isBound(bindingName) ) {
        //     return;
        // }

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

        // bind the helper into the container, if needed as singleton
        // if ( container.isBound(bindingName) ) {
        container.ensureInjectable(options.cls);
        let binding = container.bind(bindingName).to(options.cls);
        if ( options.singleton ) {
            binding.inSingletonScope();
        }


        // when resolving, get the (possibly overridden) config and add it to the helper
        binding.onActivation((ctx: any, helperClass: Function): any => {
            helperClass[ options.configKey ] = _.merge(this.config('helpers.' + options.name), customConfig);
            return helperClass;
        })
        // }


        let instance;
        // add the event listeners and bind them to the given function names
        // if ( container.isBound(bindingName) ) {
        //     return;
        // }
        Object.keys(options.listeners).forEach(eventName => {
            let fnName = options.listeners[ eventName ];

            this.events.once(eventName, (...args: any[]) => {
                instance = instance || container.make(bindingName);
                if ( kindOf(instance[ fnName ]) === 'function' ) {
                    instance[ fnName ].apply(instance, args);
                }
            })
        })

    }
}
export const cli: Cli = new Cli;
container.constant('cli', cli)