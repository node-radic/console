import { ConstructorOptions, EventEmitter2 } from "eventemitter2";
import { container, inject, singleton } from "./Container";
import { defined } from "@radic/util";
import { Log } from "./log";
import { Cli } from "./Cli";
import { defaults } from "../defaults";
import * as _ from "lodash";

container.ensureInjectable(EventEmitter2);

container.bind('cli.config.events').toConstantValue(defaults.events())

export abstract class Event {
    public get cli(): Cli {
        return container.get<Cli>('cli');
    }

    constructor(public event: string | string[] = undefined) {}
}
export abstract class HaltEvent extends Event {
    public halt: boolean = false;

    public stop() { this.halt = true }
}
EventEmitter2.prototype = <any> _.merge(EventEmitter2.prototype, {


    fire<T extends Event = Event>(ctx: T): T {
        if(this.disabled === true) return;
        let event: string | string[] = ctx.event;

        // this.log.silly('firing event: ' + event, { ctx })
        this.emit(event, ctx);
        if ( ctx instanceof HaltEvent ) {
            if ( ctx.halt ) {
                this.halt(event, ctx);
            }
        }
        return ctx;
    },

    halt<T extends HaltEvent = HaltEvent>(event: string | string[], ctx: T) {
        process.exit()
    },

    dispatch(name, ...args: any[]): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.emitAsync(name, this).then((ret: any) => {
                if ( false === defined(ret) || ret !== false ) {
                    return resolve(true);
                }
                resolve(false);
            })
        })
    },

    enableDebug() {
        this.onAny((...args: any[]) => {
            console.log('event:', args[ 0 ])
        })
        return this;
    },

    disable() {
        this.disabled = true;
        return this;
    },
    enable() {
        this.disabled = false;
        return this;
    },
    isEnabled() : boolean {
        return ! this.disabled
    }
});

export const events = new EventEmitter2(defaults.events());
container.bind('cli.events').toConstantValue(events);