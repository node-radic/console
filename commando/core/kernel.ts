import COMMANDO from "./bindings";
import { kernel } from "../../src";
export { lazyInject, provide, provideSingleton, inject, injectable, decorate } from "../../src";
export { kernel };
import { config } from "./config";
import { paths } from "./paths";
import { Keys } from "./keys";


kernel.bind(COMMANDO.CONFIG).toDynamicValue(config)
kernel.bind(COMMANDO.PATHS).toConstantValue(paths)
kernel.bind(COMMANDO.KEYS).to(Keys)


// import { makeProvideDecorator } from "inversify-binding-decorators";
// import getDecorators from "inversify-inject-decorators";

// import {kindOf} from '@radic/util'
// import Factory = inversifyInterfaces.Factory
// import Context = inversifyInterfaces.Context

//
// export class CommandoKernel extends Kernel {
//     /**
//      * Create an instance of a class using the container, making it injectable at runtime and able to @inject on the fly
//      * @param cls
//      * @returns {T}
//      */
//     build<T>(cls: any): T {
//         this.ensureInjectable(cls);
//         let k = 'temporary.kernel.binding'
//         this.bind(k).to(cls);
//         let instance = this.get<T>(k)
//         this.unbind(k)
//         return instance;
//     }
//
//     /**
//      * make binds the class in the IoC container if not already bound. then returns the bound instance
//      *
//      * @param cls
//      * @returns {T}
//      */
//     make<T>(cls: any): T {
//         this.ensureInjectable(cls);
//         let binding = cls.toString()
//         if ( this.isBound(binding) ) {
//             return this.get<T>(binding)
//         }
//         this.bind(binding).to(cls);
//         return this.get<T>(binding)
//     }
//
//     protected ensureInjectable(cls: Function) {
//         try { decorate(injectable(), cls); } catch ( err ) {}
//     }
//
//
// }
//
// let commando  = new CommandoKernel;
// let { lazyInject }   = getDecorators(commando);
// let provide          = makeProvideDecorator(commando);
// let provideSingleton = function (identifier) {
//     return provide(identifier)
//         [ 'inSingletonScope' ]()
//         .done();
// };
// export { provide, lazyInject, provideSingleton, commando }
// export * from 'inversify'
