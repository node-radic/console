import { interfaces } from "inversify";
import { kindOf } from "@radic/util";
import * as _ from "lodash";

import { Config } from "./config";
import { Log } from "../modules/log";
import { Dispatcher } from "./Dispatcher";
import { HelperContainerResolvedEvent,  HelperDependencyMissingEvent ,HelpersStartedEvent, HelpersStartingEvent, HelperStartedEvent, HelperStartingEvent } from "./events";
import Context = interfaces.Context;
import { Modules } from "./Modules";
import { HelperOptions, HelperOptionsConfig } from "../interfaces";
import { defaults } from "../defaults";
import { container, inject, lazyInject, singleton } from "./Container";
import { HelperDependencyMissingError } from "../errors";


@singleton('cli.helpers')
export class Helpers {

    protected _startedHelpers: Array<string>              = []
    protected _helpers: { [name: string]: HelperOptions } = {}

    @inject('cli.events')
    public events: Dispatcher;

    @inject('cli.log')
    public log: Log;

    @inject('cli.config')
    protected config: Config;

    @inject('cli.modules')
    protected modules: Modules;

    protected started: boolean = false;

    public has(name: string): boolean {
        return ! ! this._helpers[ name ]
    }

    public isEnabled(name: string): boolean {
        return this._helpers[ name ].enabled === true
    }

    public add<T>(options: HelperOptions): HelperOptions {
        options = _.merge(defaults.helper(), options);
        this.config.set('helpers.' + options.name, options.config);
        return this._helpers[ options.name ] = options;
    }

    public enable(name: string, customConfig: HelperOptionsConfig = {}) {
        // enable the helper so it'll start when needed
        this._helpers[ name ].enabled = true;
        let a                         = this.config.get<string[]>('enabledHelpers', [])
        this.config.set('enabledHelpers', a.concat([ name ]));

        // merge any configuration overrides
        let config = this.config.get('helpers.' + name);
        config     = _.merge({}, config, customConfig);
        this.config.set('helpers.' + name, config);

        // auto-start the helper if it is enabled after cli start
        if ( this.started ) {
            this.startHelper(name);
        }
    }

    /**
     * loops trough all enabled helpers and starts them
     */
    public startHelpers() {
        let enabledHelpers: string[] = this.config.get<string[]>('enabledHelpers', [])
        if ( this.started === false ) {
            if ( this.events.fire(new HelpersStartingEvent(this, enabledHelpers)).isCanceled() ) return
        }
        enabledHelpers.forEach(name => {
            this.events.fire(new HelperStartingEvent(this, name)).proceed(() => {
                this.startHelper(name);
                this.events.fire(new HelperStartedEvent(this, name))
            })
        })
        if ( this.started === false ) {
            this.events.fire(new HelpersStartedEvent(this, enabledHelpers))
        }
        this.started = true
    }

    /**
     * some helpers can/need to be enabled before usage
     */
    protected startHelper(name: string, customConfig: HelperOptionsConfig = {}) {
        let options: HelperOptions = this._helpers[ name ];
        if ( this._startedHelpers.includes(name) ) {
            return;
        }

        // check if the helper is contained in a module and load it if so
        if ( this.modules.exists(name) ) {
            this.modules.get(name);
        }

        // start dependency helpers
        if ( options.depends.length > 0 ) {
            options.depends.forEach(depend => {
                if ( ! Object.keys(this._helpers).includes(depend) ) {
                    this.events.fire(new HelperDependencyMissingEvent(name, depend, options).proceed(() => {
                        if ( ! options.enableDepends ) {
                            throw new HelperDependencyMissingError(name, depend)
                        }
                        this.startHelper(depend);
                    }))
                }
            })
        }

        // bind the helper into the container, if needed as singleton
        let bindingName = 'cli.helpers.' + options.name;
        container.ensureInjectable(options.cls);
        options.binding = container.bind(bindingName).to(options.cls);
        if ( options.singleton ) {
            options.binding.inSingletonScope()
        }

        // applies the configuration on activation
        options.binding.onActivation((ctx: Context, helperClass: Function): any => {
            helperClass[ options.configKey ] = this.config('helpers.' + options.name);
            this.events.fire(new HelperContainerResolvedEvent(helperClass, options))
            return helperClass
        });
        this.log.debug('started helper ' + name);

        // add the event listeners (if any) and let them call the corresponding methods
        let instance;
        Object.keys(options.listeners).forEach(eventName => {
            let fnName = options.listeners[ eventName ];

            this.events.once(eventName, (...args: any[]) => {
                instance = instance || container.get(bindingName);
                if ( kindOf(instance[ fnName ]) === 'function' ) {
                    instance[ fnName ].apply(instance, args);
                }
            })
        })

        this._startedHelpers.push(name);
        this._helpers[ name ] = options;
    }


}