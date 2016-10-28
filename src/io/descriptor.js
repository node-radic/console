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
var Descriptor = (function () {
    function Descriptor() {
    }
    Descriptor.prototype.getCommandTree = function (from) {
        var _this = this;
        var f = this.factory, c = this.config('colors'), tree = f.getTree(), stop = false;
        var mapNode = function (node) {
            if (node.type === 'group') {
                return {
                    label: "{group}" + node.name + "{/group} : {description}" + node.desc + "{/description}",
                    nodes: node['children'] ? node['children'].map(mapNode) : []
                };
            }
            if (node.type === 'command') {
                var command = _this.factory.createCommand(node);
                var args_1 = command.definition.getArguments();
                var names = Object.keys(args_1);
                var out = "{command}" + node.name + "{/command} ";
                out += names.map(function (name) {
                    var arg = args_1[name];
                    var out = arg.name;
                    if (arg.default)
                        out += '=' + arg.default;
                    if (arg.required === true)
                        return '[' + out + ']';
                    else
                        return '{dimgray}<' + out + '>{/dimgray}';
                }).join(' ');
                return out;
            }
        };
        return tree.map(mapNode);
    };
    Descriptor.prototype.commandTree = function (label, from) {
        if (label === void 0) { label = 'Overview'; }
        this.out.tree("{header}" + label + "{/header}", this.getCommandTree());
        return this;
    };
    Descriptor.prototype.getGroup = function (group) {
        var children = this.factory.getGroupChildren(group ? group.name : null, group ? group.parent : undefined);
        var table = this.out.columns();
        children.forEach(function (child) {
            table.push([("{" + child.type + "}" + child.name + "{/" + child.type + "}"), ("{description}" + child.desc + "{/description}")]);
        });
        return table;
    };
    Descriptor.prototype.group = function (group) {
        this.out.line(this.getGroup(group).toString());
        return this;
    };
    Descriptor.prototype.getCommand = function (command) {
        var args = this.getArguments(command.definition), options = this.getOptions(command.definition), usage = this.getUsage(command.definition), example = this.getExample(command.definition), globalOptions = this.getOptions(command.globalDefinition);
        return { args: args, options: options, usage: usage, example: example, globalOptions: globalOptions };
    };
    Descriptor.prototype.command = function (command, showGlobal) {
        if (showGlobal === void 0) { showGlobal = true; }
        var c = this.config, _a = this.getCommand(command), args = _a.args, options = _a.options, usage = _a.usage, example = _a.example, globalOptions = _a.globalOptions;
        if (usage)
            this.out
                .line()
                .header(c('descriptor.text.usage'))
                .line(usage);
        if (args.length)
            this.out
                .line()
                .header(c('descriptor.text.arguments'))
                .line(args.toString());
        if (options.length)
            this.out
                .line()
                .header(c('descriptor.text.options'))
                .line(options.toString());
        if (showGlobal && globalOptions.length)
            this.out
                .line()
                .header(c('descriptor.text.globalOptions'))
                .line(globalOptions.toString());
        if (example)
            this.out
                .line()
                .header(c('descriptor.text.example'))
                .line(example);
        return this;
    };
    Descriptor.prototype.getOptions = function (definition) {
        var opts = definition.getJoinedOptions();
        var table = this.out.columns();
        var prefixKey = function (key) { return (key.length === 1 ? '-' : '--') + key; };
        Object.keys(opts).forEach(function (key) {
            var opt = opts[key];
            var keys = [prefixKey(key)];
            var aliases = definition.getOptions().alias[key] || [];
            keys = keys.concat(aliases.map(prefixKey)).join('|');
            table.push([keys, opt.desc, ("[{yellow}" + opt.type + "{/yellow}]")]);
        });
        return table;
    };
    Descriptor.prototype.options = function (definition) {
        this.out.line(this.getOptions(definition).toString());
        return this;
    };
    Descriptor.prototype.getArguments = function (definition) {
        var args = definition.getArguments();
        var table = this.out.columns();
        Object.keys(args).forEach(function (name) {
            var arg = args[name];
            table.push([("{argument}" + name + "{/argument}"), ("{description}" + arg.desc + "{/description}"), arg.required ? '[{required}required{/required}]' : '']);
        });
        return table;
    };
    Descriptor.prototype.arguments = function (definition) {
        this.out.line(this.getArguments(definition).toString());
        return this;
    };
    Descriptor.prototype.getExample = function (definition) {
        return definition.getExample();
    };
    Descriptor.prototype.example = function (definition) {
        this.out.line(this.getExample(definition));
        return this;
    };
    Descriptor.prototype.getUsage = function (definition) {
        return definition.getUsage();
    };
    Descriptor.prototype.usage = function (definition) {
        this.out.line(this.getUsage(definition));
        return this;
    };
    Descriptor.prototype.argumentsCli = function (cli) {
    };
    Descriptor.prototype.commandsCli = function (cli) {
        var c = this.config;
        if (c('app.title') && c('descriptor.cli.showTitle') === true)
            this.out.write("{title}" + c('app.title') + "{/title} ");
        if (c('app.version') && c('descriptor.cli.showVersion'))
            this.out.write("{subtitle}" + c('app.version') + "{/subtitle}");
        if (c('app.description') && c('descriptor.cli.showDescription'))
            this.out.line().write("{description}" + c('app.description') + "{/description}");
        this.out.line().line();
        var group = this.getGroup(null);
        var options = this.getOptions(cli.definition);
        var globalOptions = this.getOptions(cli.globalDefinition);
        var tree = this.getCommandTree();
        this.out.line("{header}" + c('descriptor.text.commands') + "{/header}").line(group.toString()).line();
        this.out.line("{header}" + c('descriptor.text.options') + "{/header}").line(options.toString()).line();
        this.out.line("{header}" + c('descriptor.text.globalOptions') + "{/header}").line(globalOptions.toString()).line();
    };
    Descriptor.prototype.cli = function (cli) {
        if (cli instanceof core_1.ArgumentsCli) {
            this.argumentsCli(cli);
        }
        else if (cli instanceof core_1.CommandsCli) {
            this.commandsCli(cli);
        }
        else {
            throw new Error('CLI Tpp');
        }
    };
    __decorate([
        core_1.inject(core_1.BINDINGS.OUTPUT), 
        __metadata('design:type', Object)
    ], Descriptor.prototype, "out", void 0);
    __decorate([
        core_1.inject(core_1.BINDINGS.CONFIG), 
        __metadata('design:type', Function)
    ], Descriptor.prototype, "config", void 0);
    __decorate([
        core_1.inject(core_1.BINDINGS.COMMANDS_FACTORY), 
        __metadata('design:type', Object)
    ], Descriptor.prototype, "factory", void 0);
    Descriptor = __decorate([
        core_1.injectable(), 
        __metadata('design:paramtypes', [])
    ], Descriptor);
    return Descriptor;
}());
exports.Descriptor = Descriptor;
//# sourceMappingURL=descriptor.js.map