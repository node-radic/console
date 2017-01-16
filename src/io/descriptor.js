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
let Descriptor = class Descriptor {
    getCommandTree(from) {
        let f = this.factory, c = this.config('colors'), tree = f.getTree(), stop = false;
        let mapNode = (node) => {
            if (node.type === 'group') {
                return {
                    label: `{group}${node.name}{/group} : {description}${node.desc}{/description}`,
                    nodes: node['children'] ? node['children'].map(mapNode) : []
                };
            }
            if (node.type === 'command') {
                let command = this.factory.createCommand(node);
                let args = command.definition.getArguments();
                let names = Object.keys(args);
                let out = `{command}${node.name}{/command} `;
                out += names.map((name) => {
                    let arg = args[name];
                    let out = arg.name;
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
    }
    commandTree(label = 'Overview', from) {
        this.out.tree(`{header}${label}{/header}`, this.getCommandTree());
        return this;
    }
    getGroup(group) {
        return this.getGroupChildren(group).all;
    }
    getGroupChildren(group) {
        let children = this.factory.getGroupChildren(group ? group.name : null, group ? group.parent : undefined);
        let all = this.out.columns();
        let commands = this.out.columns();
        let groups = this.out.columns();
        children.forEach((child) => {
            let row = [`{${child.type}}${child.name}{/${child.type}}`, `{description}${child.desc}{/description}`];
            if (child.type === 'command')
                commands.push(row);
            if (child.type === 'group')
                groups.push(row);
            all.push(row);
        });
        return { commands, groups, all };
    }
    group(group) {
        this.out.line(this.getGroup(group).toString());
        return this;
    }
    getCommand(command) {
        let group = this.getGroup();
        let args = this.getArguments(command.definition), options = this.getOptions(command.definition), usage = this.getUsage(command.definition), example = this.getExample(command.definition), globalOptions = this.getOptions(command.globalDefinition);
        return { args, options, usage, example, globalOptions };
    }
    command(command, showGlobal = true) {
        let c = this.config, { args, options, usage, example, globalOptions } = this.getCommand(command);
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
    }
    getOptions(definition) {
        let opts = definition.getJoinedOptions();
        let table = this.out.columns();
        let prefixKey = (key) => (key.length === 1 ? '-' : '--') + key;
        Object.keys(opts).forEach((key) => {
            let opt = opts[key];
            let keys = [prefixKey(key)];
            let aliases = definition.getOptions().alias[key] || [];
            keys = keys.concat(aliases.map(prefixKey));
            keys.sort((a, b) => a.length - b.length);
            table.push([keys.join('{grey}|{/grey}'), opt.desc, `[{yellow}${opt.type}{/yellow}]`]);
        });
        return table;
    }
    options(definition) {
        this.out.line(this.getOptions(definition).toString());
        return this;
    }
    getArguments(definition) {
        let args = definition.getArguments();
        let table = this.out.columns();
        Object.keys(args).forEach((name) => {
            let arg = args[name];
            table.push([`{argument}${name}{/argument}`, `{description}${arg.desc}{/description}`, arg.required ? '' : '[{optional}optional{/optional}]']);
        });
        return table;
    }
    arguments(definition) {
        this.out.line(this.getArguments(definition).toString());
        return this;
    }
    getExample(definition) {
        return definition.getExample();
    }
    example(definition) {
        this.out.line(this.getExample(definition));
        return this;
    }
    getUsage(definition) {
        return definition.getUsage();
    }
    usage(definition) {
        this.out.line(this.getUsage(definition));
        return this;
    }
    argumentsCli(cli) {
    }
    commandsCli(cli) {
        let c = this.config;
        if (c('app.title') && c('descriptor.cli.showTitle') === true)
            this.out.write(`{title}${c('app.title')}{/title} `);
        if (c('app.version') && c('descriptor.cli.showVersion'))
            this.out.write(`{subtitle}${c('app.version')}{/subtitle}`);
        if (c('app.description') && c('descriptor.cli.showDescription'))
            this.out.line().write(`{description}${c('app.description')}{/description}`);
        this.out.line().line();
        let group = this.getGroup(null);
        let options = this.getOptions(cli.definition);
        let globalOptions = this.getOptions(cli.globalDefinition);
        this.out.line(`{header}${c('descriptor.text.commands')}{/header}`).line(group.toString()).line();
        this.out.line(`{header}${c('descriptor.text.options')}{/header}`).line(options.toString()).line();
        this.out.line(`{header}${c('descriptor.text.globalOptions')}{/header}`).line(globalOptions.toString()).line();
    }
    cli(cli) {
        if (cli instanceof core_1.ArgumentsCli) {
            this.argumentsCli(cli);
        }
        else if (cli instanceof core_1.CommandsCli) {
            this.commandsCli(cli);
        }
        else {
            throw new Error('CLI Tpp');
        }
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
exports.Descriptor = Descriptor;
//# sourceMappingURL=descriptor.js.map