import { Container as BaseContainer, interfaces } from "inversify";
export declare type ServiceIdentifier = interfaces.ServiceIdentifier<any>;
export declare class Container extends BaseContainer {
    protected static instance: Container;
    protected constructor(containerOptions?: interfaces.ContainerOptions);
    static getInstance(): Container;
    build<T>(cls: any, factoryMethod?: (context: interfaces.Context) => any): T;
    make<T>(cls: any): T;
    getParentClasses(cls: Function, classes?: Function[]): Function[];
    ensureInjectable(cls: Function): void;
    bindTo(id: ServiceIdentifier): (target: any) => any;
    lazyInject(id: ServiceIdentifier): (proto: any, key: string) => void;
    singleton(id: ServiceIdentifier, cls: any): void;
    inject(id: ServiceIdentifier): (target: any, targetKey: string, index?: number | undefined) => void;
    injectable(): (target: any) => any;
    decorate(decorator: (ClassDecorator | ParameterDecorator), target: any, parameterIndex?: number): void;
    constant<T>(id: string, val: T): interfaces.BindingWhenOnSyntax<{}>;
}
export declare const container: Container;
export declare const injectable: () => (target: any) => any;
export declare const lazyInject: (serviceIdentifier: string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>) => (proto: any, key: string) => void;
export declare const provide: (serviceIdentifier: string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>) => (target: any) => any;
export declare const singleton: (identifier: string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>) => (target: any) => any;
export declare const inject: (id: string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>) => (target: any, targetKey: string, index?: number) => void;
export declare const bindTo: (id: string | symbol | interfaces.Newable<any> | interfaces.Abstract<any>) => (target: any) => any;
