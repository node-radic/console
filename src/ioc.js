"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var inversify_binding_decorators_1 = require("inversify-binding-decorators");
var inversify_inject_decorators_1 = require("inversify-inject-decorators");
var Container = (function (_super) {
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
    Container.prototype.build = function (cls, factoryMethod) {
        this.ensureInjectable(cls);
        var k = 'temporary.kernel.binding';
        if (factoryMethod) {
            this.bind(k).toFactory(factoryMethod);
        }
        else {
            this.bind(k).to(cls);
        }
        var instance = this.get(k);
        this.unbind(k);
        return instance;
    };
    Container.prototype.make = function (cls) {
        this.ensureInjectable(cls);
        var binding = cls.toString();
        if (this.isBound(binding)) {
            return this.get(binding);
        }
        this.bind(binding).to(cls);
        return this.get(binding);
    };
    Container.prototype.ensureInjectable = function (cls) {
        try {
            inversify_1.decorate(inversify_1.injectable(), cls);
        }
        catch (err) { }
    };
    Container.bind = function (id) {
        return exports.provide(id);
    };
    Container.lazyInject = function (id) {
        return exports.lazyInject(id);
    };
    Container.singleton = function (id) {
        return exports.provideSingleton(id);
    };
    Container.inject = function (id) {
        return inversify_1.inject(id);
    };
    Container.injectable = function () {
        return inversify_1.injectable();
    };
    Container.decorate = function (decorator, target, parameterIndex) {
        return inversify_1.decorate(decorator, target, parameterIndex);
    };
    return Container;
}(inversify_1.Container));
exports.Container = Container;
var container = Container.getInstance();
exports.lazyInject = inversify_inject_decorators_1.default(Container.getInstance()).lazyInject;
exports.provide = inversify_binding_decorators_1.makeProvideDecorator(Container.getInstance());
var fprovide = inversify_binding_decorators_1.makeFluentProvideDecorator(Container.getInstance());
exports.provideSingleton = function (identifier) {
    return fprovide(identifier).inSingletonScope().done();
};
//# sourceMappingURL=ioc.js.map