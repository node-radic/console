import { Container, inject, singleton } from "./ioc";
import * as _ from "lodash";
import i from "../interfaces";
import { IConfigProperty } from "../config";
import { interfaces } from "inversify";
import { Events } from "./Events";
import { kindOf } from "@radic/util";


/**
 * Contains all the defined commands and groups
 */
@singleton('console.registry')
export class Registry {
    get commands(): i.CommandConfig[] {
        return this._commands;
    }

    get groups(): i.GroupConfig[] {
        return this._groups;
    }

    private _groups: i.GroupConfig[]                          = []
    private _commands: i.CommandConfig[]                      = []
    private _options: i.DecoratedConfig<i.OptionConfig>[]     = [];
    private _arguments: i.DecoratedConfig<i.ArgumentConfig>[] = [];
    private _helpers: { [name: string]: i.HelperOptions }     = {}
    private _root: i.RootConfig

    constructor(@inject('console.nodes.defaults.group') private _groupDefaults: i.GroupConfig,
                @inject('console.nodes.defaults.command') private _commandDefaults: i.CommandConfig,
                @inject('console.config') private _config: IConfigProperty,
                @inject('console.events') private _events: Events) {
        this._root = <i.RootConfig> this.createGroupConfig(<any> {
            name    : '_root',
            instance: null
        })
    }

    get container(): Container {
        return Container.getInstance();
    }

    get root(): i.RootConfig | any {
        return this._root
    }

    setRoot(options: i.RootConfig) {
        // wacky stuff here
        let rootGroup: any = this.createGroupConfig(options);
        Object.keys(options.globalOptions).forEach(key => {
            rootGroup.options[ key ]        = options.globalOptions[ key ];
            rootGroup.options[ key ].global = true;
        })
        this._root = <i.RootConfig> rootGroup;
    }


    addGroup(options: i.GroupConfig): i.GroupConfig {
        // let isRoot = this.isRoot(options);
        this._groups.push(options = this.createGroupConfig(options));
        return options;
    }

    addCommand(options: i.CommandConfig): i.CommandConfig {
        // let isRoot = this.isRoot(options);
        options = this.createCommandConfig(options);
        this._commands.push(options);
        return options;
    }

    addOption(config: i.DecoratedConfig<i.OptionConfig>) {
        this._options.push(config);
    }

    addArgument(config: i.DecoratedConfig<i.ArgumentConfig>) {
        this._arguments.push(config);
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
            config   : {}
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

        // add the event listeners and bind them to the given function names
        Object.keys(options.listeners).forEach(eventName => {
            let fnName = options.listeners[ eventName ];
            this._events.on(eventName, (...args: any[]) => {
                let instance = this.container.make(bindingName);
                if ( kindOf(instance[ fnName ]) === 'function' ) {
                    instance[ fnName ].apply(instance, args);
                }
            })
        })

    }


    protected makeid(len: number = 15) {
        var text     = "";
        var possible = "abcdefghijklmnopqrstuvwxyz";

        for ( var i = 0; i < len; i ++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    protected createGroupConfig(options: i.GroupConfig = {}): i.GroupConfig {
        options = _.merge({}, this._groupDefaults, options);
        if ( options.cls === null ) {
            let fn     = function () {}
            let desc   = Object.getOwnPropertyDescriptor(fn, 'name');
            desc.value = this.makeid()
            Object.defineProperty(fn, 'name', desc);
            options.cls = fn;
        }
        return options;
    }

    protected createCommandConfig(options: i.CommandConfig = {}) {
        options = _.merge({}, this._commandDefaults, options);

        if ( options.cls === null ) {
            let fn     = function () {}
            let desc   = Object.getOwnPropertyDescriptor(fn, 'name');
            desc.value = this.makeid()
            Object.defineProperty(fn, 'name', desc);
            options.cls = fn;
            if ( options.handle !== null ) {
                options.cls.prototype.handle = options.handle
            }
        }

        _.filter(this._options, { cls: options.cls }).forEach((opt: i.DecoratedConfig<i.OptionConfig>) => {
            // join name and aliases, sort by str length and pick the top to get shortest
            if ( opt.config.alias === undefined ) opt.config.alias = [];
            let alias: any[] = [ opt.key ].concat(kindOf(opt.config.alias) !== 'array' ? [ <string> opt.config.alias ] : opt.config.alias).sort((a: string, b: string) => a.length - b.length)
            let name         = alias.shift();
            let type         = opt.type.name.toString().toLowerCase()
            if ( opt.config.type !== undefined ) {
                opt.config.array = true;
                type             = opt.config.type
            }

            options.options[ name ] = _.merge(opt.config, { alias, type });

            // @todo: default value
        })

        return options;
    }

}
