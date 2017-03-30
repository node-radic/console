import{ EventEmitter2 } from 'eventemitter2'
import { Container } from "./ioc";

Container.ensureInjectable(EventEmitter2);

Container.getInstance().bind('console.events.config').toConstantValue({
    wildcard    : true,
    delimiter   : ':',
    newListener : true,
    maxListeners: 200,

})

@Container.singleton('console.events')
export default class Events extends EventEmitter2 {
    constructor(@Container.inject('console.events.config') conf: EventEmitter2Configuration) {
        super(conf)
    }
}