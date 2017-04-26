import { Container, inject, singleton } from "./Container";
import * as _ from "lodash";
import * as S from "string";
import i from "../interfaces";
import { IConfigProperty } from "../config";
import { interfaces } from "inversify";
import { Events } from "./Events";
import { kindOf } from "@radic/util";
import { Defaults } from "./nodes";


/**
 * Contains all the defined commands and groups
 */
@singleton('console.registry')
export class Registry {
    get commands(): i.CommandNodeConfig[] {
        return this._commands;
    }

    get groups(): i.GroupNodeConfig[] {
        return this._groups;
    }

    private _groups: i.GroupNodeConfig[]                      = []
    private _commands: i.CommandNodeConfig[]                  = []
    private _options: i.DecoratedConfig<i.OptionConfig>[]     = [];
    private _arguments: i.DecoratedConfig<i.ArgumentConfig>[] = [];
    private _helpers: { [name: string]: i.HelperOptions }     = {}

    private _root: i.NodeConfig
    private _rootCls: any;

    constructor(@inject('console.defaults.nodes') private _defaults: Defaults,
                @inject('console.config') private _config: IConfigProperty,
                @inject('console.events') private _events: Events) {
        this._root = this.createGroupConfig(<any> {
            name: '_root'
        })
    }

    get container(): Container {
        return Container.getInstance();
    }

    get root(): i.NodeConfig | i.CommandNodeConfig | i.GroupNodeConfig {
        return this._root
    }

    get rootCls(): any {
        return this._rootCls;
    }

    setRoot(cls: any) {
        this._rootCls = cls;
    }

    protected checkAndAddRoot(options: i.NodeConfig): boolean {

        if ( this._rootCls === undefined ) throw new Error('Cannot add node. Declare a root node first.')
        if ( options.cls === this._rootCls ) {
            this._root = options;
            return true;
        }
        return false;
    }


    addGroup(options: i.GroupNodeConfig): i.GroupNodeConfig {
        options = this.createGroupConfig(options)
        if ( this.checkAndAddRoot(options) === false ) {
            this._groups.push(options);
        }
        return options;
    }


    protected createGroupConfig(config: i.GroupNodeConfig = {}): i.GroupNodeConfig {
        config = _.merge({}, this._defaults.group, config);
        if ( config.cls === null ) {
            let fn     = function () {}
            let desc   = Object.getOwnPropertyDescriptor(fn, 'name');
            desc.value = this.makeid()
            Object.defineProperty(fn, 'name', desc);
            config.cls = fn;
        }

        this.findAndAddOptions(config);

        return config;
    }

    addCommand(options: i.CommandNodeConfig): i.CommandNodeConfig {
        options = this.createCommandConfig(options);
        if ( this.checkAndAddRoot(options) === false ) {
            this._commands.push(options);
        }
        return options;
    }

    protected createCommandConfig(config: i.CommandNodeConfig = {}) {
        config = _.merge({}, this._defaults.command, config);

        if ( config.cls === null ) {
            let fn     = function () {}
            let desc   = Object.getOwnPropertyDescriptor(fn, 'name');
            desc.value = this.makeid()
            Object.defineProperty(fn, 'name', desc);
            config.cls = fn;
            if ( config.handle !== null ) {
                config.cls.prototype.handle = config.handle
            }
        }

        this.findAndAddOptions(config);
        this.findAndAddArguments(config);

        return config;
    }

    addOption(optionConfig: i.DecoratedConfig<i.OptionConfig> = {}) {
        optionConfig   = _.merge({
            config: this._defaults.option
        }, optionConfig);
        let nodeConfig = _.find([ this.root ].concat(this.groups, this.commands), { cls: optionConfig.cls })
        if ( nodeConfig ) {
            this.addOptionToNodeConfig(nodeConfig, optionConfig);
        }
        this._options.push(optionConfig);
    }

    protected addOptionToNodeConfig(config: i.NodeConfig, opt: i.DecoratedConfig<i.OptionConfig>) {
        let key = S(opt.key).dasherize().toString();
        // join name and aliases, sort by str length and pick the top to get shortest
        if ( opt.config.alias === undefined ) opt.config.alias = [];
        let alias: any[] = [ key ].concat(kindOf(opt.config.alias) !== 'array' ? [ <string> opt.config.alias ] : opt.config.alias).sort((a: string, b: string) => a.length - b.length)
        let name         = alias.shift();
        let type         = opt.type.name.toString().toLowerCase()
        if ( opt.config.type !== undefined && type === 'array' ) {
            opt.config.array = true;
            type             = opt.config.type
        }
        config.options[ name ] = _.merge(opt.config, { alias, type });
    }

    protected findAndAddOptions(config: i.NodeConfig) {
        _.filter(this._options, { cls: config.cls }).forEach((opt: i.DecoratedConfig<i.OptionConfig>) => {
            this.addOptionToNodeConfig(config, opt);
        })

        Object.keys(config.options).forEach(key => {
            if ( config.options[ key ].global ) {

            }
        })
        return config;
    }


    addArgument(argumentConfig: i.DecoratedConfig<i.ArgumentConfig> = {}) {
        argumentConfig = _.merge({
            config: this._defaults.argument
        }, argumentConfig);
        this._arguments.push(argumentConfig);
        let nodeConfig = _.find([ this.root ].concat(this.groups, this.commands), { cls: argumentConfig.cls })
        if ( nodeConfig ) {
            this.addArgumentToNodeConfig(nodeConfig, argumentConfig);
        }
    }


    protected makeid(len: number = 15) {
        let text       = "";
        const possible = "abcdefghijklmnopqrstuvwxyz";

        for ( let i = 0; i < len; i ++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    protected addArgumentToNodeConfig(options: i.CommandNodeConfig, opt: i.DecoratedConfig<i.ArgumentConfig>) {

    }

    protected findAndAddArguments(config: i.CommandNodeConfig) {
        _.filter(this._arguments, { cls: config.cls }).forEach((opt: i.DecoratedConfig<i.ArgumentConfig>) => {
            this.addArgumentToNodeConfig(config, opt);
        })
    }


    addHelper<T>(options: i.HelperOptions): i.HelperOptions {
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
        this._config.set('helpers.' + options.name, options.config);
        this._helpers[ options.name ] = options;

        return options;
    }

    /** some helpers can/need to be enabled before usage **/
    enableHelper(name: string, customConfig: i.HelperOptionsConfig = {}) {
        let options = this._helpers[ name ];
        this._config.merge('helpers.' + options.name, customConfig);

        // bind the helper into the container
        let bindingName = 'console.helpers.' + options.name;
        Container.ensureInjectable(options.cls);
        let binding = this.container
            .bind(bindingName)
            .to(options.cls);
        if ( options.singleton ) binding.inSingletonScope();

        // when resolving, get the (possibly overridden) config and add it to the helper
        binding.onActivation((ctx: interfaces.Context, helperClass: Function): any => {
            helperClass[ options.configKey ] = this._config('helpers.' + options.name);
            return helperClass;
        })

        let instance;
        // add the event listeners and bind them to the given function names
        Object.keys(options.listeners).forEach(eventName => {
            let fnName = options.listeners[ eventName ];

            this._events.on(eventName, (...args: any[]) => {
                instance = instance || this.container.make(bindingName);
                if ( kindOf(instance[ fnName ]) === 'function' ) {
                    instance[ fnName ].apply(instance, args);
                }
            })
        })

    }

}
