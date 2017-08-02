import { HelperOptions, HelperOptionsConfig } from "../interfaces";
import { defaults } from "../defaults";
import { container, inject, lazyInject, singleton } from "./Container";
import { interfaces } from "inversify";
import { kindOf } from "@radic/util";
import { Config } from "./config";
import * as _ from "lodash";
import { Dispatcher } from "./Dispatcher";
import { HelpersStartedEvent, HelpersStartingEvent, HelperStartedEvent, HelperStartingEvent } from "./events";
import Context = interfaces.Context;

@singleton('cli.helpers')
export class Helpers {

    protected _startedHelpers: Array<string>              = []
    protected _helpers: { [name: string]: HelperOptions } = {}


    @inject('cli.events')
    public events: Dispatcher;


    @lazyInject('cli.config')
    protected config: Config;

    protected started: boolean = false;


    public addHelper<T>(options: HelperOptions): HelperOptions {
        options = _.merge(defaults.helper(), options);
        this.config.set('helpers.' + options.name, options.config);
        return this._helpers[ options.name ] = options;
    }

    public enableHelper(name: string, customConfig: HelperOptionsConfig = {}) {
        this._helpers[ name ].enabled = true;

        let config = this.config.get('helpers.' + name);
        config     = _.merge({}, config, customConfig);
        this.config.set('helpers.' + name, config);

        let a = this.config.get<string[]>('enabledHelpers', [])
        this.config.set('enabledHelpers', a.concat([ name ]));

    }

    public startHelpers(customConfigs: { [name: string]: HelperOptionsConfig } = {}) {
        let enabledHelpers: string[] = this.config.get<string[]>('enabledHelpers', [])
        if ( this.started === false ) {
            if ( this.events.fire(new HelpersStartingEvent(this, enabledHelpers, customConfigs)).isCanceled() ) return
        }
        enabledHelpers.forEach(name => {
            this.events.fire(new HelperStartingEvent(this, name, customConfigs[ name ] || {})).proceed(() => {
                this.startHelper(name, customConfigs[ name ] || {});
                this.events.fire(new HelperStartedEvent(this, name))
            })
        })
        if ( this.started === false ) {
            this.events.fire(new HelpersStartedEvent(this, enabledHelpers))
        }
        this.started = true
    }

    /** some helpers can/need to be enabled before usage **/
    protected startHelper(name: string, customConfig: HelperOptionsConfig = {}) {
        let options = this._helpers[ name ];
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


}