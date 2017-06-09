import { ConstructorOptions, EventEmitter2 } from "eventemitter2";
import { container, inject, singleton } from "./Container";
import { defined } from "@radic/util";
import { Log } from "./log";
import { Cli } from "./Cli";
import { defaults } from "../defaults";

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

@singleton('cli.events')
export class Events extends EventEmitter2 {
    // @lazyInject('cli.log')
    // protected log: Log;

    protected disabled:boolean = false
    constructor(@inject('cli.config.events') conf: ConstructorOptions,
                @inject('cli.log') protected log: Log) {
        super(conf)
    }

    fire<T extends Event>(ctx: T): T
    fire<T extends Event>(event: string | string[], ctx: T): T
    fire<T extends Event>(...args: any[]): T {
        if(this.disabled === true) return;
        let event: string | string[];
        let ctx: T = args[ args.length - 1 ];

        if ( args.length === 2 ) event = args[ 0 ];
        if ( event === undefined ) event = ctx.event;

        this.log.silly('firing event: ' + event, { ctx })
        super.emit(event, ctx);
        if ( ctx instanceof HaltEvent ) {
            if ( ctx.halt ) {
                this.halt<typeof ctx>(event, ctx);
            }
        }
        return ctx;
    }

    halt<T extends HaltEvent>(event: string | string[], ctx: T) {
        process.exit()
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

    enableDebug() : this{
        this.onAny((...args: any[]) => {
            console.log('event:', args[ 0 ])
        })
        return this;
    }

    disable() :this {
        this.disabled = true;
        return this;
    }
    enable() :this {
        this.disabled = false;
        return this;
    }
    isEnabled() : boolean {
        return ! this.disabled
    }
}