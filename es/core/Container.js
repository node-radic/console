var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { Container as BaseContainer, decorate, inject as _inject, injectable as _injectable } from "inversify";
import { makeFluentProvideDecorator, makeProvideDecorator } from "inversify-binding-decorators";
import getDecorators from "inversify-inject-decorators";
var Container = /** @class */ (function (_super) {
    __extends(Container, _super);
    function Container(containerOptions) {
        return _super.call(this, containerOptions) || this;
    }
    Container.getInstance = function () {
        if (Container.instance === undefined) {
            Container.instance = new Container();
        }
        return Container.instance;
    };
    /**
     * Create an instance of a class using the container, making it injectable at runtime and able to @inject on the fly
     * @param cls
     * @param factoryMethod
     * @returns {T}
     */
    Container.prototype.build = function (cls, factoryMethod) {
        if (factoryMethod) {
            this.ensureInjectable(cls);
            var k = 'temporary.kernel.binding';
            this.bind(k).toFactory(factoryMethod);
            var instance = this.get(k);
            this.unbind(k);
            return instance;
        }
        return this.resolve(cls);
    };
    /**
     * make binds the class in the IoC container if not already bound. then returns the bound instance
     *
     * @param cls
     * @returns {T}
     */
    Container.prototype.make = function (cls) {
        return this.resolve(cls);
    };
    Container.prototype.getParentClasses = function (cls, classes) {
        if (classes === void 0) { classes = []; }
        if (cls['__proto__'] !== null) {
            classes.push(cls);
            return this.getParentClasses(cls['__proto__'], classes);
        }
        return classes;
    };
    Container.prototype.ensureInjectable = function (cls) {
        // let parents = this.getParentClasses(cls);
        //
        // parents.shift();
        try {
            decorate(injectable(), cls);
        }
        catch (err) {
            // console.log('ensureInjectable', err)
        }
    };
    Container.prototype.bindTo = function (id) {
        return provide(id);
    };
    Container.prototype.lazyInject = function (id) {
        return lazyInject(id);
    };
    Container.prototype.singleton = function (id, cls) {
        this.ensureInjectable(cls);
        this.bind(id).to(cls).inSingletonScope();
    };
    Container.prototype.inject = function (id) {
        return inject(id);
    };
    Container.prototype.injectable = function () {
        return _injectable();
    };
    Container.prototype.decorate = function (decorator, target, parameterIndex) {
        return decorate(decorator, target, parameterIndex);
    };
    Container.prototype.constant = function (id, val) {
        return this.bind(id).toConstantValue(val);
    };
    return Container;
}(BaseContainer));
export { Container };
export var container = Container.getInstance();
export var injectable = function () { return _injectable(); };
export var lazyInject = getDecorators(container).lazyInject;
export var provide = makeProvideDecorator(container);
var fprovide = makeFluentProvideDecorator(container);
export var singleton = function (identifier) {
    return fprovide(identifier).inSingletonScope().done();
};
export var inject = function (id) {
    return _inject(id);
};
export var bindTo = function (id) {
    return container.bindTo(id);
};
export { postConstruct } from 'inversify';
export { autoProvide, makeFluentProvideDecorator, makeProvideDecorator } from 'inversify-binding-decorators';
export * from 'inversify-inject-decorators';
