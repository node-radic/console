import { inject, Container as BaseContainer, decorate, injectable, interfaces } from "inversify";
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
        Container.ensureInjectable(cls);
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
        Container.ensureInjectable(cls);
        let binding = cls.toString();
        if ( this.isBound(binding) ) {
            return this.get<T>(binding)
        }
        this.bind(binding).to(cls);
        return this.get<T>(binding)
    }


    static getParentClasses(cls: Function, classes: Function[] = []): Function[] {
        if ( cls[ '__proto__' ] !== null ) {
            classes.push(cls);
            return Container.getParentClasses(cls[ '__proto__' ], classes)
        }
        return classes;
    }

    static ensureInjectable(cls: Function) {
        let parents = Container.getParentClasses(cls);

        parents.shift();

        try { decorate(injectable(), parents.shift()); } catch ( err ) {}
    }

    static bindTo(id: ServiceIdentifier) {
        return provide(id);
    }

    static lazyInject(id: ServiceIdentifier) {
        return lazyInject(id);
    }

    static singleton(id: ServiceIdentifier) {
        return provideSingleton(id);
    }

    static inject(id: ServiceIdentifier): (target: any, targetKey: string, index?: number | undefined) => void {
        return <any> inject(id);
    }

    static injectable() {
        return injectable();
    }

    static decorate(decorator: (ClassDecorator | ParameterDecorator), target: any, parameterIndex?: number) {
        return decorate(decorator, target, parameterIndex);
    }
}

const container: Container = Container.getInstance();


export const lazyInject       = getDecorators(Container.getInstance()).lazyInject;
export const provide          = makeProvideDecorator(Container.getInstance());
const fprovide                = makeFluentProvideDecorator(Container.getInstance());
export const provideSingleton = (identifier: ServiceIdentifier) => {
    return fprovide(identifier).inSingletonScope().done()
};