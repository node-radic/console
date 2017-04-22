import { ConstructorOptions, EventEmitter2 } from "eventemitter2";
import { Container, singleton } from "./Container";
import { defined, kindOf } from "@radic/util";

Container.ensureInjectable(EventEmitter2);

Container.getInstance().bind('console.events.config').toConstantValue({
    wildcard    : true,
    delimiter   : ':',
    newListener : true,
    maxListeners: 200,

})

export abstract class Event {
    constructor(public event: string | string[] = undefined) {}
}
export abstract class HaltEvent extends Event {
    public halt: boolean = false;

    public stop() { this.halt = true }
}

@singleton('console.events')
export class Events extends EventEmitter2 {
    constructor(@Container.inject('console.events.config') conf: ConstructorOptions) {
        super(conf)
    }

    fire<T extends Event>(ctx: T): T
    fire<T extends Event>(event: string | string[], ctx: T): T
    fire<T extends Event>(...args: any[]): T {
        let event: string | string[];
        let ctx: T = args[ args.length - 1 ];

        if ( args.length === 2 ) event = args[ 0 ];
        if ( event === undefined ) event = ctx.event;

        this.emit(event, ctx);
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