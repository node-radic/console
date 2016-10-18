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
var core_1 = require("../core");
var _ = require("lodash");
var groups = [];
var commands = [];
function command(name, desc, parent) {
    if (desc === void 0) { desc = ''; }
    if (parent === void 0) { parent = null; }
    return function (cls) {
        commands.push({ name: name, cls: cls, desc: desc, parent: parent, type: 'command' });
    };
}
exports.command = command;
function group(name, desc, parent) {
    if (desc === void 0) { desc = ''; }
    if (parent === void 0) { parent = null; }
    return function (cls) {
        groups.push({ name: name, cls: cls, desc: desc, parent: parent, type: 'group' });
    };
}
exports.group = group;
var BaseCommandRegistration = (function () {
    function BaseCommandRegistration() {
        this.failed = false;
        this.asyncMode = false;
    }
    Object.defineProperty(BaseCommandRegistration.prototype, "in", {
        get: function () { return this._in ? this._in : this._in = core_1.kernel.get(core_1.BINDINGS.INPUT); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseCommandRegistration.prototype, "out", {
        get: function () { return this._out ? this._out : this._out = core_1.kernel.get(core_1.BINDINGS.OUTPUT); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseCommandRegistration.prototype, "log", {
        get: function () { return this._log ? this._log : this._log = core_1.kernel.get(core_1.BINDINGS.LOG); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseCommandRegistration.prototype, "config", {
        get: function () { return this._config ? this._config : this._config = core_1.kernel.get(core_1.BINDINGS.CONFIG); },
        enumerable: true,
        configurable: true
    });
    BaseCommandRegistration.prototype.fire = function () {
        this.parse();
        if (this['handle'])
            this['handle'].apply(this);
    };
    BaseCommandRegistration.prototype.async = function () {
        this.asyncMode = true;
        return this.done;
    };
    BaseCommandRegistration.prototype.done = function () { };
    BaseCommandRegistration.prototype.fail = function (reason) {
        this.failed = true;
    };
    BaseCommandRegistration.prototype.parse = function () { };
    __decorate([
        core_1.inject(core_1.BINDINGS.DESCRIPTOR), 
        __metadata('design:type', Object)
    ], BaseCommandRegistration.prototype, "descriptor", void 0);
    __decorate([
        core_1.inject(core_1.BINDINGS.COMMANDS_FACTORY), 
        __metadata('design:type', Object)
    ], BaseCommandRegistration.prototype, "factory", void 0);
    __decorate([
        core_1.inject(core_1.BINDINGS.CLI), 
        __metadata('design:type', core_1.Cli)
    ], BaseCommandRegistration.prototype, "cli", void 0);
    return BaseCommandRegistration;
}());
exports.BaseCommandRegistration = BaseCommandRegistration;
var CommandFactory = (function () {
    function CommandFactory() {
    }
    Object.defineProperty(CommandFactory.prototype, "groups", {
        get: function () { return groups; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandFactory.prototype, "commands", {
        get: function () { return commands; },
        enumerable: true,
        configurable: true
    });
    CommandFactory.prototype.getGroupChildren = function (name, parent) {
        var groupRegistration = this.getGroup(name, parent);
        return commands.concat(groups)
            .filter(function (item) {
            return item.parent === (groupRegistration ? groupRegistration.cls : null);
        });
    };
    CommandFactory.prototype.createCommand = function (commandRegistration, argv) {
        if (argv === void 0) { argv = []; }
        var command = core_1.kernel.make(commandRegistration.cls);
        command.argv = argv;
        command.definition.mergeOptions(core_1.kernel.get(core_1.BINDINGS.CLI).globalDefinition);
        command.definition.arguments(command.arguments);
        command.definition.options(command.options);
        command.name = commandRegistration.name;
        command.desc = commandRegistration.desc;
        command.parent = commandRegistration.parent ? commandRegistration.parent : null;
        return command;
    };
    CommandFactory.prototype.createGroup = function (groupRegistration) {
        var group = core_1.kernel.make(groupRegistration.cls);
        group.name = groupRegistration.name;
        group.desc = groupRegistration.desc;
        group.parent = groupRegistration.parent ? groupRegistration.parent : null;
        return group;
    };
    CommandFactory.prototype.getTree = function () {
        return this.unflatten(commands.concat(groups));
    };
    CommandFactory.prototype.resolveFromArray = function (arr) {
        var tree = this.getTree(), stop = false, parts = [], resolved;
        while (stop === false && arr.length > 0) {
            var part = arr.shift();
            var found = _.find(tree, { name: part });
            if (found) {
                resolved = found;
                parts.push(part);
                tree = found['children'] || {};
            }
            else {
                stop = true;
                arr.unshift(part);
            }
        }
        if (resolved) {
            resolved.tree = tree;
            resolved.arguments = arr;
            resolved.hasArguments = arr.length > 0;
            return resolved;
        }
        return null;
    };
    CommandFactory.prototype.resolveFromString = function (resolvable) {
        return this.resolveFromArray(resolvable.split(' '));
    };
    CommandFactory.prototype.unflatten = function (array, parent, tree) {
        var _this = this;
        if (parent === void 0) { parent = { cls: null }; }
        if (tree === void 0) { tree = []; }
        var children = _.filter(array, function (child) {
            return child.parent === parent.cls;
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
    CommandFactory.prototype.getCommand = function (name, parent) { return _.filter(this.commands, parent ? { name: name, parent: parent } : { name: name })[0]; };
    CommandFactory.prototype.getGroup = function (name, parent) { return _.filter(this.groups, parent ? { name: name, parent: parent } : { name: name })[0]; };
    CommandFactory.prototype.addGroup = function (name, cls, desc, parent) {
        if (desc === void 0) { desc = ''; }
        groups.push({ name: name, cls: cls, desc: desc, parent: parent, type: 'group' });
    };
    CommandFactory.prototype.addCommand = function (name, cls, desc, parent) {
        if (desc === void 0) { desc = ''; }
        commands.push({ name: name, cls: cls, desc: desc, parent: parent, type: 'command' });
    };
    CommandFactory = __decorate([
        core_1.injectable(), 
        __metadata('design:paramtypes', [])
    ], CommandFactory);
    return CommandFactory;
}());
exports.CommandFactory = CommandFactory;
//# sourceMappingURL=factory.js.map