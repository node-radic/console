"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ioc_1 = require("./ioc");
var registry_1 = require("./registry");
var util_1 = require("util");
var _ = require("lodash");
var Router = Router_1 = (function () {
    function Router(registry) {
        this.registry = registry;
    }
    Router.create = function (registry) {
        return new Router_1(registry);
    };
    Router.prototype.unflatten = function (array, parent, tree) {
        var _this = this;
        if (parent === void 0) { parent = { cls: null }; }
        if (tree === void 0) { tree = []; }
        var children = _.filter(array, function (child) {
            return child.group === parent.cls;
        });
        if (!_.isEmpty(children)) {
            if (parent.cls === null) {
                tree = children;
            }
            else {
                parent['children'] = children;
            }
            _.each(children, function (child) { _this.unflatten(array, child); });
        }
        return tree;
    };
    Object.defineProperty(Router.prototype, "items", {
        get: function () {
            return [].concat(this.registry.commands, this.registry.groups);
        },
        enumerable: true,
        configurable: true
    });
    Router.prototype.getTree = function () {
        return this.unflatten(this.items);
    };
    Router.prototype.getNamedTree = function (array, tree) {
        var _this = this;
        if (tree === void 0) { tree = {}; }
        if (util_1.isUndefined(array))
            array = this.unflatten(this.items);
        array.forEach(function (item) {
            if (item.type === "group") {
                tree[item.name] = {};
                _this.getNamedTree(item['children'], tree[item.name]);
            }
            else {
                tree[item.name] = item;
            }
        });
        return tree;
    };
    Router.prototype.resolveFromArray = function (arr) {
        var tree = this.getTree(), stop = false, parts = [], resolvedChild, resolved;
        while (stop === false && arr.length > 0) {
            var part = arr.shift();
            var found = _.find(tree, { name: part });
            if (found) {
                resolvedChild = found;
                parts.push(part);
                tree = found['children'] || {};
            }
            else {
                stop = true;
                arr.unshift(part);
            }
        }
        if (resolvedChild) {
            resolved = { tree: tree, parts: parts, args: arr, hasArguments: arr.length > 0 };
            return resolved;
        }
        return null;
    };
    Router.prototype.resolveFromString = function (resolvable) {
        return this.resolveFromArray(resolvable.split(' '));
    };
    return Router;
}());
Router = Router_1 = __decorate([
    ioc_1.Container.singleton('console.router'),
    __param(0, ioc_1.Container.inject('console.registry')),
    __metadata("design:paramtypes", [registry_1.Registry])
], Router);
exports.Router = Router;
var Router_1;
//# sourceMappingURL=router.js.map