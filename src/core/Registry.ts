import { Container, inject, singleton } from "./ioc";
import * as _ from "lodash";
import i from "../interfaces";
import { CliMode } from "./cli";
import { IConfigProperty } from "../config";
import { interfaces } from "inversify";
import Events from "./Events";
import { kindOf } from "@radic/util";


/**
 * Contains all the defined commands and groups
 */
@singleton('console.registry')
export default class Registry {
    get commands(): i.CommandConfig[] {
        return this._commands;
    }

    get groups(): i.GroupConfig[] {
        return this._groups;
    }

    private _groups: i.GroupConfig[]     = []
    private _commands: i.CommandConfig[] = []
    private _plugins: { [name: string]: any }
    private _root: i.RootConfig
    private _rootGroup: i.GroupConfig;
    private _rootCommand: i.CommandConfig;

    constructor(@inject('console.nodes.defaults.group') private _groupDefaults: i.GroupConfig,
                @inject('console.nodes.defaults.command') private _commandDefaults: i.CommandConfig,
                @inject('console.config') private _config: IConfigProperty,
                @inject('console.events') private _events: Events) {
        this._rootGroup   = this.createGroupConfig({
            name         : '_root',
            globalOptions: {}
        })
        this._rootCommand = this.createCommandConfig({
            name: '_root'
        })
    }

    get container(): Container {
        return Container.getInstance();
    }

    getRoot<T extends i.NodeConfig>(mode: CliMode): T {
        if ( mode === "command" ) return <T> this._rootCommand;
        if ( mode === "groups" ) return <T> this._rootGroup;
        throw Error(`Root does not exist for given mode: ${mode}`);
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

        return options;
    }


    addGroup(options: i.GroupConfig): i.GroupConfig {
        let isRoot = this.isRoot(options);
        this._groups.push(options = this.createGroupConfig(options));
        return options;
    }

    addCommand(options: i.CommandConfig): i.CommandConfig {
        let isRoot = this.isRoot(options);
        options    = this.createCommandConfig(options);
        this._commands.push(options);
        return options;
    }

    addHelper<T>(options: i.HelperOptions): i.HelperOptions {
        // merge default options
        const defaults  = {
            name     : null,
            cls      : null,
            singleton: false,
            listeners: {},
            configKey: 'config',
            config   : {}
        }
        options         = _.merge({}, defaults, options);

        // set the helper config in the global config, so it can be overridden
        this._config.set('helpers.' + options.name, options.config);

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

        return options;
    }

    protected isRoot(options: i.NodeConfig): boolean {
        let found = _.find([].concat(this.groups, this.commands), 'cls', options.cls);
        return <any> found;
    }

    setRoot(options: i.RootConfig) {
        this._root = options;
    }

    get root(): i.RootConfig {
        return this._root
    }

    addPlugin(name: string, cls: any) {
        Container.getInstance().bind('console.plugins.' + name).to(cls)
    }

    enablePlugin(name: string) {
        Container.getInstance().make('console.plugins.' + name);
    }
}
