import { ConstructorOptions, EventEmitter2 } from "eventemitter2";
import { container, singleton } from "./Container";
import { defined } from "@radic/util";
import * as _ from "lodash";

container.ensureInjectable(EventEmitter2);

export abstract class Event {
    constructor(public event: string | string[] = undefined) {}
}
export abstract class HaltEvent extends Event {
    public halt: boolean = false;

    public stop() { this.halt = true }
}

@singleton('cli.events')
export class Events extends EventEmitter2 {
    constructor(conf:ConstructorOptions = {}) {
        super(_.merge({
            wildcard    : true,
            delimiter   : ':',
            newListener : true,
            maxListeners: 200,
        }, conf))
    }

    fire<T extends Event>(ctx: T): T
    fire<T extends Event>(event: string | string[], ctx: T): T
    fire<T extends Event>(...args: any[]): T {
        let event: string | string[];
        let ctx: T = args[ args.length - 1 ];

        if ( args.length === 2 ) event = args[ 0 ];
        if ( event === undefined ) event = ctx.event;

        super.emit(event, ctx);
        return ctx;
    }

    dispatch(name, ...args: any[]): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.emitAsync(name, this).then((ret: any) => {
                if ( false === defined(ret) || ret !== false ) {
                    return resolve(true);
                }
                resolve(false);
            })
        })
    }

    enableDebug() {
        this.onAny((...args: any[]) => {
            console.log('event:', args[ 0 ])
        })
    }

}