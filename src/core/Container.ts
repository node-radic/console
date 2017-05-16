
import { inject as _inject, Container as BaseContainer, decorate, injectable, interfaces } from "inversify";
import { makeProvideDecorator, makeFluentProvideDecorator } from "inversify-binding-decorators";
import getDecorators from "inversify-inject-decorators";


export type ServiceIdentifier = interfaces.ServiceIdentifier<any>;

export class Container extends BaseContainer  {
    protected static instance: Container;

    protected constructor(containerOptions?: interfaces.ContainerOptions) {
        super(containerOptions);
    }

    static getInstance(): Container {
        if ( Container.instance === undefined ) {
            Container.instance = new Container()
        }
        return Container.instance
    }

    /**
     * Create an instance of a class using the container, making it injectable at runtime and able to @inject on the fly
     * @param cls
     * @param factoryMethod
     * @returns {T}
     */
    build<T>(cls: any, factoryMethod?: (context: interfaces.Context) => any): T {
        this.ensureInjectable(cls);
        let k = 'temporary.kernel.binding';
        if ( factoryMethod ) {
            this.bind(k).toFactory<any>(factoryMethod);
        } else {
            this.bind(k).to(cls);
        }
        let instance = this.get<T>(k);
        this.unbind(k);
        return instance;
    }

    /**
     * make binds the class in the IoC container if not already bound. then returns the bound instance
     *
     * @param cls
     * @returns {T}
     */
    make<T>(cls: any): T {
        this.ensureInjectable(cls);
        let binding = cls.toString();
        if ( this.isBound(binding) ) {
            return this.get<T>(binding)
        }
        this.bind(binding).to(cls);
        return this.get<T>(binding)
    }


    getParentClasses(cls: Function, classes: Function[] = []): Function[] {
        if ( cls[ '__proto__' ] !== null ) {
            classes.push(cls);
            return this.getParentClasses(cls[ '__proto__' ], classes)
        }
        return classes;
    }

    ensureInjectable(cls: Function) {
        let parents = this.getParentClasses(cls);

        parents.shift();

        try { decorate(injectable(), parents.shift()); } catch ( err ) {}
    }

    bindTo(id: ServiceIdentifier) {
        return provide(id);
    }

    lazyInject(id: ServiceIdentifier) {
        return lazyInject(id);
    }

    singleton(id: ServiceIdentifier) {
        return singleton(id);
    }

    inject(id: ServiceIdentifier): (target: any, targetKey: string, index?: number | undefined) => void {
        return <any> inject(id);
    }

    injectable() {
        return injectable();
    }

    decorate(decorator: (ClassDecorator | ParameterDecorator), target: any, parameterIndex?: number) {
        return decorate(decorator, target, parameterIndex);
    }

    constant(id: string, val: any) {
        this.bind(id).toConstantValue(val);
    }
}

export const container: Container = Container.getInstance();


export const lazyInject       = getDecorators(container).lazyInject;
export const provide          = makeProvideDecorator(container);
const fprovide                = makeFluentProvideDecorator(container);

export const singleton = (identifier: ServiceIdentifier) => {
    return fprovide(identifier).inSingletonScope().done()
};

export const inject = (id:ServiceIdentifier) => {
    return _inject(id);
}
export const bindTo = (id:ServiceIdentifier) => {
    return container.bindTo(id);
}
