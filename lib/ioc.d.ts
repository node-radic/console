import { Container as BaseContainer, interfaces } from "inversify";
export declare type ServiceIdentifier = interfaces.ServiceIdentifier<any>;
export declare class Container extends BaseContainer {
    protected static instance: Container;
    protected constructor(containerOptions?: interfaces.ContainerOptions);
    static getInstance(): Container;
    build<T>(cls: any, factoryMethod?: (context: interfaces.Context) => any): T;
    make<T>(cls: any): T;
    protected ensureInjectable(cls: Function): void;
    static bind(id: ServiceIdentifier): (target: any) => any;
    static lazyInject(id: ServiceIdentifier): (proto: any, key: string) => void;
    static singleton(id: ServiceIdentifier): (target: any) => any;
    static inject(id: ServiceIdentifier): (target: any, targetKey: string, index?: number | undefined) => void;
    static injectable(): (target: any) => any;
    static decorate(decorator: (ClassDecorator | ParameterDecorator), target: any, parameterIndex?: number): void;
}
export declare const lazyInject: (serviceIdentifier: string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>) => (proto: any, key: string) => void;
export declare const provide: (serviceIdentifier: string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>) => (target: any) => any;
export declare const provideSingleton: (identifier: string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>) => (target: any) => any;
