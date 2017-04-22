import { ConstructorOptions, EventEmitter2 } from "eventemitter2";
import { Container, singleton } from "./Container";
import { defined } from "@radic/util";

Container.ensureInjectable(EventEmitter2);

Container.getInstance().bind('console.events.config').toConstantValue({
    wildcard    : true,
    delimiter   : ':',
    newListener : true,
    maxListeners: 200,

})

@singleton('console.events')
export  class Events extends EventEmitter2 {
    constructor(@Container.inject('console.events.config') conf: ConstructorOptions) {
        super(conf)
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

    enableDebug(){
        this.onAny((...args:any[]) => {
            console.log('event:', args[0])
        })
    }

}