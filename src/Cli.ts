import { kindOf } from "@radic/util";
import { container, inject, singleton } from "./Container";
import { CommandConfig, HelperOptions, HelperOptionsConfig, OptionConfig } from "./interfaces";
import { basename, dirname, join } from "path";
import { ChildProcess, spawn } from "child_process";
import { existsSync } from "fs";
import { YargsParserArgv, YargsParserOptions } from "../types/yargs-parser";
import * as _ from "lodash";
import { Events } from "./Events";
import { ConfigProperty, config } from "./config";
const parser = require('yargs-parser')
const get    = Reflect.getMetadata


@singleton('cli')
export class Cli {
    protected _helpers: { [name: string]: HelperOptions } = {}
    protected runningCommand: ChildProcess;
    protected globalOptions: OptionConfig[]               = [];

    public get events(): Events {
        return container.get<Events>('cli.events')
    }

    public readonly config: ConfigProperty = config ;

    public parse(config: CommandConfig): this {
        let args: string[] = config.argv;
        let result         = parser(config.args);

        if ( result._.length > 0 ) {
            if ( config.subCommands.length > 0 ) {
                if ( config.subCommands.includes(result._[ 0 ]) ) {
                    let dirName    = dirname(config.filePath);
                    let baseName   = basename(config.filePath, '.js');
                    let subCommand = result._[ 0 ];
                    let file       = join(dirName, baseName + '-' + subCommand + '.js');
                    if ( existsSync(file) ) {
                        config.args.shift();
                        config.args.unshift(file)
                        let proc = spawn('node', [].concat(config.args), { stdio: 'inherit' });
                        proc.on('close', process.exit.bind(process));
                        proc.on('error', function (err) {
                            if ( err[ 'code' ] == "ENOENT" ) {
                                console.error('\n  %s(1) does not exist, try --help\n', file);
                            } else if ( err[ 'code' ] == "EACCES" ) {
                                console.error('\n  %s(1) not executable. try chmod or run with root\n', file);
                            }
                            process.exit(1);
                        });

                        // Store the reference to the child process
                        this.runningCommand = proc;
                    }
                }
            }
        }

        if ( ! this.runningCommand ) {
            console.log('WE ARE THERERERE')
            this.executeCommand(config);
        }
        return this;
    }

    protected executeCommand(config: CommandConfig) {
        let optionConfigs: OptionConfig[] = get('options', config.cls.prototype);
        optionConfigs.push.apply(optionConfigs, this.globalOptions);
        let transformedOptions = this.transformOptions(optionConfigs);
        let argv               = parser(config.args, transformedOptions) as YargsParserArgv;


        if ( kindOf(config.action) === 'function' ) {
            config.cls.prototype[ 'handle' ] = config.action
        }

        let instance = container.build(config.cls);

        _.without(Object.keys(argv), '_').forEach((argName: string, argIndex: number) => {
            instance[ argName ] = argv[ argName ];
        })

        instance[ 'handle' ].apply(instance, argv._);


        console.log({ optionConfigs })
    }

    /** transforms my option structure to the yargs-parser option structure */
    protected transformOptions(configs: OptionConfig[]): YargsParserOptions {
        let options: YargsParserOptions = {
            array        : [],
            boolean      : [],
            string       : [],
            number       : [],
            count        : [],
            // config?: boolean
            coerce       : {},
            alias        : {},
            default      : {},
            narg         : {},
            normalize    : true,
            configuration: {
                'short-option-groups'      : true,
                'camel-case-expansion'     : true,
                'dot-notation'             : true,
                'parse-numbers'            : true,
                'boolean-negation'         : true,
                'duplicate-arguments-array': true,
                'flatten-duplicate-arrays' : true,
            }
        };
        configs.forEach((config: OptionConfig, iconfig: number) => {
            let key  = config.key;
            let type = config.type || 'boolean';

            options.alias[ key ] = [ config.name ];

            if ( config.count ) {
                options.count.push(key)
                type = undefined
            }

            if ( config.array === true ) options.array.push(key);
            if ( config.transformer ) options.coerce[ key ] = config.transformer;
            if ( config.arguments ) options.narg[ key ] = config.arguments;
            if ( config.default ) options.default[ key ] = config.default

            if ( type !== undefined ) {
                options[ type ].push(key);
                configs[ iconfig ][ 'type' ] = type;
            }
        })
        return options;
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
            name     : null,
            cls      : null,
            singleton: false,
            enabled  : false,
            listeners: {},
            configKey: 'config',
            config   : {},
            bindings : {}
        }
        options        = _.merge({}, defaults, options);

        // set the helper config in the global config, so it can be overridden
        this.config.set('helpers.' + options.name, options.config);
        this._helpers[ options.name ] = options;

        return options;
    }

    /** some helpers can/need to be enabled before usage **/
    public enableHelper(name: string, customConfig: HelperOptionsConfig = {}) {
        let options = this._helpers[ name ];
        this.config.merge('helpers.' + options.name, customConfig);

        // bind the helper into the container, if needed as singleton
        let bindingName = 'console.helpers.' + options.name;
        container.ensureInjectable(options.cls);
        let binding = container.bind(bindingName).to(options.cls);
        if ( options.singleton ) {
            binding.inSingletonScope();
        }

        // when resolving, get the (possibly overridden) config and add it to the helper
        binding.onActivation((ctx: any, helperClass: Function): any => {
            helperClass[ options.configKey ] = this.config('helpers.' + options.name);
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
export const cli: Cli = container.get<Cli>('cli')
