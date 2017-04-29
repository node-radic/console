import { interfaces as i } from "../interfaces";
import { Container, inject, singleton } from "./Container";
import { meta } from "../utils";
import { IConfigProperty, kindOf } from "@radic/util";
import * as _ from "lodash";
import { cloneDeep, defaults, merge } from "lodash";
import { Defaults } from "./nodes";
import { Events } from "./Events";
import { CliParseEvent } from "./Cli";


@singleton('console.repository')
export class Repository {
    nodes: i.NodeConfig[]                        = []
    root: i.CommandNodeConfig | i.GroupNodeConfig;
    helpers: { [name: string]: i.HelperOptions } = {}


    constructor(@inject('console.defaults.nodes') private _defaults: Defaults,
                @inject('console.config') private _config: IConfigProperty,
                @inject('console.events') private _events: Events) {}


    setRoot(cls: Function) {
        let config = meta(cls).get<i.NodeConfig>('config');
        this.root  = config;
    }

    addNode(cls: Function | i.NodeConfig): i.NodeConfig {
        let config: i.NodeConfig = cls;
        if ( meta(cls).has('config') ) {
            config    = meta(cls).get<i.NodeConfig>('config');
            let proto = cls[ 'prototype' ];
            let keys  = Reflect.getMetadataKeys(proto);
            if ( keys.includes('options') ) {
                this.addDecoratedOptionsToNode(proto, config);
            }
            if ( keys.includes('arguments') ) {
                this.addArguments(proto, config);
            }
        }
        defaults(config, config.type === 'command' ? this._defaults.getCommand() : this._defaults.getGroup())
        this.nodes.push(config);
        return config;
    }


    addOption(keys: string[], optionConfig: i.OptionConfig, config: i.NodeConfig) {
        let names = cloneDeep(keys);
        let name  = names.sort((a, b) => a.length - b.length).shift()
        meta(config.cls).set('options', [
            merge({
                key   : name,
                config: { name, alias: names }
            }, {
                config: optionConfig
            })
        ].concat(meta(config.cls).get<any>('options', [])))
        this.addDecoratedOptionsToNode(config.cls, config);
    }

    protected addDecoratedOptionsToNode(proto: Object, config: i.NodeConfig) {
        config.options                                           = config.options || {};
        let options: [ { key: string, config: i.OptionConfig } ] = Reflect.getMetadata('options', proto);
        options.forEach((opt) => {
            _.defaults(opt, { config: this._defaults.getOption() });
            let key = opt.key.toString();
            key     = key.length === 1 ? key : _.kebabCase(key);
            // join name and aliases, sort by str length and pick the top to get shortest
            if ( opt.config.alias === undefined ) opt.config.alias = [];
            let alias: any[] = [ key ].concat(kindOf(opt.config.alias) !== 'array' ? [ <string> opt.config.alias ] : opt.config.alias).sort((a: string, b: string) => a.length - b.length)
            let name         = alias.shift();

            let type = Reflect.getMetadata('design:type', proto, opt.key)
            type     = type !== undefined ? type.name.toString().toLowerCase() : opt.config.type;
            if ( opt.config.type !== undefined && type === 'array' ) {
                opt.config.array = true;
                type             = opt.config.type
            }
            let options = _.merge(opt.config, { alias, type });
            if ( opt.config.global ) {
                this._events.on('cli:parse:resolved', function (event: CliParseEvent) {
                    event.nodeConfig.options[ name ] = options;
                    return event;
                })
            }
            config.options[ name ] = options;
        })
        Reflect.deleteMetadata('options', proto);
    }

    protected addArguments(proto: Object, config: i.CommandNodeConfig) {
        let args = Reflect.getMetadata('arguments', proto);
        // args.
        // _.defaults(opt, { config: this._defaults.getOption() });
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
        this.helpers[ options.name ] = options;

        return options;
    }

    /** some helpers can/need to be enabled before usage **/
    enableHelper(name: string, customConfig: i.HelperOptionsConfig = {}) {
        let options = this.helpers[ name ];
        this._config.merge('helpers.' + options.name, customConfig);

        // bind the helper into the container, if needed as singleton
        let bindingName = 'console.helpers.' + options.name;
        Container.ensureInjectable(options.cls);
        const container = Container.getInstance();
        let binding     = container.bind(bindingName).to(options.cls);
        if ( options.singleton ) {
            binding.inSingletonScope();
        }

        // when resolving, get the (possibly overridden) config and add it to the helper
        binding.onActivation((ctx: any, helperClass: Function): any => {
            helperClass[ options.configKey ] = this._config('helpers.' + options.name);
            return helperClass;
        })

        let instance;
        // add the event listeners and bind them to the given function names
        Object.keys(options.listeners).forEach(eventName => {
            let fnName = options.listeners[ eventName ];

            this._events.on(eventName, (...args: any[]) => {
                instance = instance || container.make(bindingName);
                if ( kindOf(instance[ fnName ]) === 'function' ) {
                    instance[ fnName ].apply(instance, args);
                }
            })
        })

    }
}