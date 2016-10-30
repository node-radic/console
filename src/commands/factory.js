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
const core_1 = require("../core");
const _ = require("lodash");
const util_1 = require("@radic/util");
let groups = [];
let commands = [];
function command(name, prettyName, desc = '', parent = null) {
    prettyName = prettyName || name;
    return (cls) => {
        commands.push({ name, cls, prettyName, desc, parent, type: 'command' });
    };
}
exports.command = command;
let registrations = [];
function COMMAND(name, prettyName, options = {}) {
    options = _.merge({
        name,
        prettyName: prettyName || name,
        desc: '',
        parent: null,
        type: 'command',
        arguments: {},
        options: {}
    }, options);
    return (cls) => {
        options.cls = cls;
        registrations.push(options);
    };
}
exports.COMMAND = COMMAND;
function group(name, prettyName, desc = '', parent = null) {
    prettyName = prettyName || name;
    return (cls) => {
        groups.push({ name, cls, prettyName, desc, parent, type: 'group' });
    };
}
exports.group = group;
class BaseCommandRegistration {
    constructor() {
        this.failed = false;
        this.asyncMode = false;
    }
    get in() { return this._in ? this._in : this._in = core_1.kernel.get(core_1.BINDINGS.INPUT); }
    get out() { return this._out ? this._out : this._out = core_1.kernel.get(core_1.BINDINGS.OUTPUT); }
    get log() { return this._log ? this._log : this._log = core_1.kernel.get(core_1.BINDINGS.LOG); }
    get config() { return this._config ? this._config : this._config = core_1.kernel.get(core_1.BINDINGS.CONFIG); }
    fire() {
        this.parse();
        if (this['handle'])
            this['handle'].apply(this);
    }
    async() {
        this.asyncMode = true;
        return this.done;
    }
    done() { }
    fail(reason) {
        this.failed = true;
    }
    parse() { }
}
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
exports.BaseCommandRegistration = BaseCommandRegistration;
function toObj(arr) {
    let obj = {};
    arr.forEach((key) => {
        obj[key] = {};
    });
    return obj;
}
let CommandFactory = class CommandFactory {
    get groups() { return groups; }
    get commands() { return commands; }
    getGroupChildren(name, parent) {
        let groupRegistration = this.getGroup(name, parent);
        return commands.concat(groups)
            .filter((item) => {
            return item.parent === (groupRegistration ? groupRegistration.cls : null);
        });
    }
    createCommand(registration, argv = []) {
        let command = core_1.kernel.make(registration.cls);
        command.argv = argv;
        let options = _.cloneDeep(command.options);
        let args = _.cloneDeep(command.arguments);
        if (util_1.kindOf(options) === 'array')
            options = toObj(options);
        if (util_1.kindOf(args) === 'array')
            args = toObj(args);
        command.definition.arguments(args);
        command.definition.options(options);
        if (command.example)
            command.definition.example(command.example);
        if (command.usage)
            command.definition.usage(command.usage);
        command.name = registration.name;
        command.desc = registration.desc;
        command.prettyName = registration.prettyName;
        command.parent = registration.parent ? registration.parent : null;
        return command;
    }
    createGroup(registration) {
        let group = core_1.kernel.make(registration.cls);
        group.name = registration.name;
        group.desc = registration.desc;
        group.prettyName = registration.prettyName;
        group.parent = registration.parent ? registration.parent : null;
        return group;
    }
    getTree() {
        return this.unflatten(commands.concat(groups));
    }
    resolveFromArray(arr) {
        let tree = this.getTree(), stop = false, parts = [], resolved;
        while (stop === false && arr.length > 0) {
            let part = arr.shift();
            let found = _.find(tree, { name: part });
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
            resolved.parts = parts;
            resolved.arguments = arr;
            resolved.hasArguments = arr.length > 0;
            return resolved;
        }
        return null;
    }
    resolveFromString(resolvable) {
        return this.resolveFromArray(resolvable.split(' '));
    }
    unflatten(array, parent = { cls: null }, tree = []) {
        var children = _.filter(array, (child) => {
            return child.parent === parent.cls;
        });
        if (!_.isEmpty(children)) {
            if (parent.cls === null) {
                tree = children;
            }
            else {
                parent['children'] = children;
            }
            _.each(children, (child) => { this.unflatten(array, child); });
        }
        return tree;
    }
    getCommand(name, parent) { return _.filter(this.commands, parent ? { name, parent } : { name })[0]; }
    getGroup(name, parent) { return _.filter(this.groups, parent ? { name, parent } : { name })[0]; }
    addGroup(name, prettyName, cls, desc = '', parent) { groups.push({ name, cls, prettyName, desc, parent, type: 'group' }); }
    addCommand(name, prettyName, cls, desc = '', parent) { commands.push({ name, prettyName, cls, desc, parent, type: 'command' }); }
};
CommandFactory = __decorate([
    core_1.injectable(), 
    __metadata('design:paramtypes', [])
], CommandFactory);
exports.CommandFactory = CommandFactory;
//# sourceMappingURL=factory.js.map