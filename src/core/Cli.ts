import { kindOf } from "@radic/util";
import { container, lazyInject } from "./Container";
import { CommandConfig, HelperOptions, HelperOptionsConfig, OptionConfig } from "../interfaces";
import { basename, dirname, join, sep } from "path";
import { ChildProcess, fork, spawn } from "child_process";
import { existsSync, statSync } from "fs";
import { YargsParserArgv, YargsParserOptions } from "../../types/yargs-parser";
import * as _ from "lodash";
import { Events, HaltEvent } from "./Events";
import { Log, log } from "./log";
import { Config } from "./config";
import { transformOptions } from "../utils";
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

export class Cli {
    protected _helpers: { [name: string]: HelperOptions } = {}
    protected runningCommand: ChildProcess;
    protected globalOptions: OptionConfig[]               = [];

    protected _mode = 'require';

    public mode(mode: string) {
        this._mode = mode;
    }


    @lazyInject('cli.events')
    public events: Events;

    @lazyInject('cli.log')
    public log: Log;

    @lazyInject('cli.config')
    public config: Config;

    // public get events(): Events {
    //     return container.make<Events>('cli.events')
    // }


    public parse(config: CommandConfig): this {

        this.events.fire(new CliParseEvent(config, this.globalOptions))

        let transformedOptions = transformOptions(this.globalOptions);
        let result             = parser(config.args, transformedOptions) as YargsParserArgv;

        this.events.fire(new CliParsedEvent(config, result, this.globalOptions))

        // Check if sub-command should be invoked
        if ( result._.length > 0 &&
            config.subCommands.length > 0 &&
            config.subCommands.includes(result._[ 0 ]) ) {

            let filePath = this.findSubCommandFilePath(result._[ 0 ], config.filePath)

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
        if ( ! this.runningCommand ) {
            this.log.debug('WE ARE THERERERE')
            this.executeCommand(config);
        }

        return this;
    }

    protected findSubCommandFilePath(subCommand, filePath): string {
        let dirName  = dirname(filePath);
        let baseName = basename(filePath, '.js');
        // various locations to search for the sub-command file
        // this can, and "maby" should have a couple of more variations
        let locations     = [
            join(dirName, baseName + '-' + subCommand + '.js'),
            join(dirName, baseName + '.' + subCommand + '.js'),
            join(dirName, baseName + '_' + subCommand + '.js'),
            join(dirName, baseName + sep + subCommand + '.js')
        ]
        let foundFilePath = null;
        locations.forEach(location => {
            if ( foundFilePath ) return;
            if ( existsSync(location) ) {
                let stat = statSync(location);
                if ( stat.isSymbolicLink() ) {
                    this.log.notice('Trying to access symlinked command. Not sure if it\'l work')
                    foundFilePath = location
                }
                if ( stat.isFile() ) {
                    foundFilePath = location
                }
            }
        })

        if ( null === foundFilePath ) {
            throw new Error(`Could not find sub-command [${subCommand}] for parent file [${filePath}]`);
        }

        return foundFilePath;
    }

    protected handleRequire(filePath: string, config: CommandConfig): this {
        // remove the sub-command argument from the argv array, so the next time parse() is called, we dont get in weird results
        process.argv.splice(0, 1);

        const module = require(filePath);

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
        this.runningCommand = proc;

        return this;
    }

    protected executeCommand(config: CommandConfig) {

        this.startHelpers();

        let optionConfigs: OptionConfig[] = get('options', config.cls.prototype) || [];

        this.events.fire(new CliExecuteCommandParseEvent(config, optionConfigs))

        optionConfigs.push.apply(optionConfigs, this.globalOptions);
        let transformedOptions = transformOptions(optionConfigs);
        let argv               = parser(config.args, transformedOptions) as YargsParserArgv;


        this.events.fire(new CliExecuteCommandParsedEvent(argv, config, optionConfigs))

        if ( kindOf(config.action) === 'function' ) {
            config.cls.prototype[ 'handle' ] = config.action
        }

        let instance = container.build(config.cls);

        _.without(Object.keys(argv), '_').forEach((argName: string, argIndex: number) => {
            instance[ argName ] = argv[ argName ];
        })


        this.events.fire(new CliExecuteCommandHandleEvent(instance, argv, config, optionConfigs))

        const result: any = instance[ 'handle' ].apply(instance, argv._);

        this.events.fire(new CliExecuteCommandHandledEvent(result, instance, argv, config, optionConfigs))


        this.log.silly('options', { optionConfigs })
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
        let bindingName = 'cli.helpers.' + options.name;
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

        let instance;
        // add the event listeners and bind them to the given function names
        Object.keys(options.listeners).forEach(eventName => {
            let fnName = options.listeners[ eventName ];

            this.events.on(eventName, (...args: any[]) => {
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