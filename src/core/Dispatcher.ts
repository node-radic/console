import { EventAndListener, EventEmitter2, eventNS, Listener } from "eventemitter2";
import { lazyInject, singleton } from "./Container";
import { defined } from "@radic/util";
import { Log } from "./Log";
import { defaults } from "../defaults";
import { HaltEvent, Event, CancelEvent } from "./events";

@singleton('cli.events')
/**
 * Event dispatcher. Bound to `cli.events` as singleton. Utilizes EventEmitter2 under the hood.
 *
 * It adds some extra functionality, primarily the fire(), halt() and dispatch() methods.
 * The fire() class expects a subclass of Event to be provided, which will be passed to the listeners.
 * This is the preferred way of firing events within the application
 *
 * @see Event
 * @see HaltEvent
 * @example
 * ```typescript
 * const events= container.get<Dispatcher>('cli.events')
 *
 + export class CliParsedEvent extends HaltEvent {
 +    constructor(public config: CommandConfig, public argv: YargsParserArgv, public globals: OptionConfig[]) {
 +        super('cli:parsed')
 +    }
 + }
 *
 * events.listen('cli:parsed, (event:CliParsedEvent) => {
 *      event.config.alwaysRun = true;
 * })
 * events.fire(new CliParsedEvent(config, argv, globals)
 * ```
 */
export class Dispatcher {
    private ee: EventEmitter2;
    @lazyInject('cli.log')
    protected log: Log;

    constructor() {
        this.ee = new EventEmitter2(defaults.events())

    }

    fire<T extends Event | HaltEvent | CancelEvent>(ctx: T): T
    fire<T extends Event | HaltEvent | CancelEvent>(event: string | string[], ctx: T): T
    fire<T extends Event | HaltEvent | CancelEvent>(...args: any[]): T {
        let event: string | string[];
        let ctx: T = args[ args.length - 1 ];

        if ( args.length === 2 ) event = args[ 0 ];
        if ( event === undefined ) event = ctx.event;

        this.log.silly('firing event: ' + event, { ctx })
        this.emit(event, ctx);
        if ( ctx instanceof HaltEvent ) {
            if ( ctx['_halt'] ) {
                this.halt<typeof ctx>(event, ctx);
            }
        }
        return ctx;
    }

    halt<T extends HaltEvent>(event: string | string[], ctx: T) {
        process.exit()
    }

    dispatch(name, ...args: any[]): Promise<boolean> {
        return < Promise<boolean>> new Promise((resolve, reject) => {
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

    emit(event: string | string[], ...values: any[]): boolean { return this.ee.emit.apply(this.ee, [ event ].concat(values))};

    emitAsync(event: string | string[], ...values: any[]): Promise<any[]> { return this.ee.emitAsync.apply(this.ee, [ event ].concat(values)); }

    addListener(event: string, listener: Listener): this { return this.ee.addListener.apply(this.ee, [ event, listener ]); }

    on(event: string | string[], listener: Listener): this { return this.ee.on.apply(this.ee, [ event, listener ]); }

    prependListener(event: string | string[], listener: Listener): this { return this.ee.prependListener.apply(this.ee, [ event, listener ]); }

    once(event: string | string[], listener: Listener): this { return this.ee.once.apply(this.ee, [ event, listener ]); }

    prependOnceListener(event: string | string[], listener: Listener): this { return this.ee.prependOnceListener.apply(this.ee, [ event, listener ]); }

    many(event: string | string[], timesToListen: number, listener: Listener): this { return this.ee.many.apply(this.ee, [ event, timesToListen, listener ]); }

    prependMany(event: string | string[], timesToListen: number, listener: Listener): this { return this.ee.prependMany.apply(this.ee, [ event, timesToListen, listener ]); }

    onAny(listener: EventAndListener): this { return this.ee.onAny.apply(this.ee, [ listener ]); }

    prependAny(listener: EventAndListener): this { return this.ee.prependAny.apply(this.ee, [ listener ]); }

    offAny(listener: Listener): this { return this.ee.offAny.apply(this.ee, [ listener ]); }

    removeListener(event: string | string[], listener: Listener): this { return this.ee.removeListener.apply(this.ee, [ event, listener ]); }

    off(event: string, listener: Listener): this { return this.ee.off.apply(this.ee, [ event, listener ]); }

    removeAllListeners(event?: string | eventNS): this { return this.ee.removeAllListeners.apply(this.ee, [ event ]); }

    setMaxListeners(n: number): void { return this.ee.setMaxListeners.apply(this.ee, [ n ]); }

    eventNames(): string[] { return this.ee.eventNames.apply(this.ee, []); }

}
