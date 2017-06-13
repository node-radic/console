import { HelperOptions, HelperOptionsConfig } from "../interfaces";
import { defaults } from "../defaults";
import { container, inject, injectable, lazyInject, singleton } from "./Container";
import { interfaces } from "inversify";
import Context = interfaces.Context;
import { kindOf } from "@radic/util";
import { Config } from "./config";
import * as _ from "lodash";
import { Dispatcher } from "./Dispatcher";

@singleton('cli.helpers')
export class Helpers {

    protected _startedHelpers: Array<string>              = []
    protected _helpers: { [name: string]: HelperOptions } = {}



    @inject('cli.events')
    public events: Dispatcher;


    @lazyInject('cli.config')
    protected config: Config;


    public addHelper<T>(options: HelperOptions): HelperOptions {
        options   = _.merge(defaults.helper(), options);
        this.config.set('helpers.' + options.name, options.config);
        return this._helpers[ options.name ] = options;
    }

    public enableHelper(name: string, customConfig: HelperOptionsConfig = {}) {
        this._helpers[ name ].enabled = true;

        let config = this.config.get('helpers.' + name);
        config = _.merge({}, config, customConfig);
        this.config.set('helpers.' + name, config);

        let a =  this.config.get<string[]>('enabledHelpers', [])
        this.config.set('enabledHelpers', a.concat([name]));

    }

    public startHelpers(customConfigs: { [name: string]: HelperOptionsConfig } = {}) {
        this.config.get<string[]>('enabledHelpers', []).forEach(name => {
            this.startHelper(name, customConfigs[ name ] || {});
        })
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