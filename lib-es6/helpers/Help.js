var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { kindOf } from "@radic/util";
import { helper } from "../decorators";
import { inject } from "../core/Container";
import { OutputHelper } from "./Output";
import { getSubCommands } from "../utils";
import { Cli } from "../core/Cli";
import { Dispatcher } from "../core/Dispatcher";
import { HelpHelperOnInvalidArgumentsShowHelpEvent, HelpHelperShowHelpEvent } from "./events";
import * as _ from "lodash";
var CommandDescriptionHelper = (function () {
    function CommandDescriptionHelper() {
    }
    CommandDescriptionHelper.prototype.showHelp = function (config, options) {
        if (config.helpers['help']) {
            _.merge(this.config, config.helpers['help']);
        }
        this.events.fire(new HelpHelperShowHelpEvent(config, options));
        this.printHelp(config, options);
    };
    CommandDescriptionHelper.prototype.printHelp = function (config, options) {
        var name = config.name, desc = config.description || '', example = config.example || '', usage = config.usage || '';
        this.printTitle(config);
        if (this.config.display.description && !this.config.display.descriptionAsTitle && config.description.length > 0) {
            this.out.line(config.description);
        }
        if (this.config.display.explenation && config.explenation.length > 0) {
            this.out.line(config.explenation);
        }
        if (this.config.display.usage) {
            if (usage.length === 0 && config.arguments.length > 0) {
                usage = this.getParsedCommandNames().join(' ');
                usage += ' ';
                usage += config.arguments.map(function (arg) {
                    name = arg.name + (arg.alias ? '|' + arg.alias : '');
                    return arg.required ? '<' + name + '>' : '[' + name + ']';
                }).join(' ');
            }
            if (usage.length > 0) {
                this.out.nl.line(this.config.templates.usage).line(usage);
            }
        }
        if (this.config.display.arguments && config.arguments.length > 0) {
            this.out.nl.line('{header}Arguments:{/header}');
            this.printArguments(config.arguments);
        }
        if (this.config.display.subCommands && config.isGroup) {
            this.out.nl.line('{header}Commands:{/header}');
            this.printSubCommands(config);
        }
        if (this.config.display.options && options.length > 0) {
            this.out.nl.line('{header}Options:{/header}');
            this.printOptions(options);
        }
        if (this.config.display.globalOptions) {
            this.out.nl.line('{header}Global options:{/header}');
            this.printGlobalOptions();
        }
        if (this.config.display.example && example.length > 0) {
            this.out.nl.line('{header}Examples:{/header}').line(example);
        }
    };
    CommandDescriptionHelper.prototype.printArguments = function (args) {
        if (args === void 0) { args = []; }
        var rows = [];
        args.forEach(function (arg) {
            var row = [];
            var name = [
                arg.required ? '<' : '[',
                arg.name,
                arg.alias ? '|' + arg.alias : '',
                arg.required ? '>' : ']',
            ].join('');
            row.push(name);
            row.push(arg.description || '');
            var type = [
                '[',
                arg.variadic ? '{array}Array<{/array}' : '',
                "{type}" + (arg.type !== undefined ? arg.type : 'string') + "{/type}",
                arg.variadic ? '{array}>{/array}' : '',
                ']'
            ].join('');
            row.push(type);
            if (arg.required) {
                type += ' [{required}required{/required}]';
            }
            rows.push(row);
        });
        this.out.columns(rows, {
            columnSplitter: '  ',
            showHeaders: false,
            preserveNewLines: true
        });
    };
    CommandDescriptionHelper.prototype.printTitle = function (config) {
        var title = config.name;
        if (this.cli.rootCommand.cls === config.cls) {
            title = this.config.app.title || config.name;
        }
        else if (this.config.display.descriptionAsTitle && config.description.length > 0) {
            title = config.description;
        }
        if (this.config.display.title) {
            this.out.nl.line("{title}" + title + "{/title}");
            if (this.config.display.titleLines) {
                this.out.line("{titleLines}" + '-'.repeat(title.length) + "{/titleLines}");
            }
        }
    };
    CommandDescriptionHelper.prototype.printSubCommands = function (config) {
        var _this = this;
        var rows = [];
        var groups = {};
        getSubCommands(config.filePath, false, true).forEach(function (command) {
            var desc = '', name = null, args = [];
            desc = command.description;
            name = command.name;
            args = command.arguments;
            var type = command.isGroup ? 'grouped' : 'command';
            var line = ["{" + type + "}" + command.name + "{/" + type + "}", "{desc}" + desc + "{/desc}"];
            if (command.group) {
                if (!groups[command.group])
                    groups[command.group] = [];
                groups[command.group].push(line);
            }
            else {
                rows.push(line);
            }
        });
        this.out.columns(rows, {
            columnSplitter: '   ',
            showHeaders: false,
            preserveNewLines: true
        });
        Object.keys(groups).forEach(function (group) {
            _this.out.nl.line("{orange}" + group + " commands:{/orange}");
            _this.out.columns(groups[group], {
                columnSplitter: '   ',
                showHeaders: false,
                preserveNewLines: true
            });
        });
    };
    CommandDescriptionHelper.prototype.printGlobalOptions = function () {
        this.printOptions(this.cli['globalOptions']);
    };
    CommandDescriptionHelper.prototype.printOptions = function (options) {
        var rows = [];
        var s = this.config.styles;
        options.forEach(function (option) {
            var desc = option.description;
            var maxWidth = 50;
            if (desc && desc.length > maxWidth) {
                var remaining = desc.length;
                var result = '';
                while (remaining > maxWidth) {
                    result += desc.slice(desc.length - remaining, result.length + maxWidth) + '\n';
                    remaining -= maxWidth;
                }
                if (remaining > 0) {
                    result += desc.slice(desc.length - remaining, result.length + maxWidth);
                }
                desc = result;
            }
            var type = option.type;
            if (type === undefined && option.count) {
                type = 'count';
            }
            type = "{type}" + type + "{/type}";
            if (option.array) {
                type = "{cyan}Array<{/cyan}" + type + "{cyan}>{/cyan}";
            }
            type = '[' + type + ']';
            var name = option.name;
            var hasName = !!name;
            var key = '-' + option.key + (name ? '|--' + name : '');
            if (option.arguments > 0) {
            }
            if (option.default) {
            }
            var columns = [
                key,
                desc,
                type
            ];
            rows.push(columns);
        });
        this.out.columns(rows, {
            columnSplitter: '   ',
            showHeaders: false,
            preserveNewLines: true
        });
    };
    CommandDescriptionHelper.prototype.printCommandTree = function (label, config) {
        if (label === void 0) { label = 'Command tree:'; }
        this.out.tree(label, this.getTreeSubcommands(this.cli.rootCommand || config || {}));
    };
    CommandDescriptionHelper.prototype.getTreeSubcommands = function (config) {
        var _this = this;
        var obj = getSubCommands(config.filePath);
        return Object.keys(obj).map(function (subCommand) {
            return _this.config.templates.treeItem(subCommand, Reflect.getMetadata('options', subCommand['cls'].prototype));
        });
    };
    CommandDescriptionHelper.prototype.getSubcommandsNameTree = function (config) {
        var obj = {};
        return obj;
    };
    CommandDescriptionHelper.prototype.getParsedCommandNames = function () {
        return this.cli.parsedCommands.map(function (cmd) {
            return cmd.name;
        });
    };
    CommandDescriptionHelper.prototype.onCommandParse = function (event) {
        if (this.config.option.enabled === true) {
            event.cli.global(this.config.option.key, {
                name: this.config.option.name,
                type: 'boolean',
                description: 'show help'
            });
        }
    };
    CommandDescriptionHelper.prototype.onCommandHandle = function (event) {
        var _this = this;
        if (this.config.addShowHelpFunction) {
            this.out.styles(this.config.style);
            event.instance['showHelp'] = function () {
                _this.showHelp(event.config, event.options);
            };
            if (event.argv[this.config.option.key]) {
                this.events.emit('help:' + event.config.name);
                if (kindOf(event.instance['help']) === 'function') {
                    event.instance['help'].apply(event.instance, [event.config, event.options]);
                    return event.stop();
                }
                this.showHelp(event.config, event.options);
                return event.stop();
            }
        }
    };
    CommandDescriptionHelper.prototype.onInvalidArguments = function (event) {
        if (this.config.showOnError === true && event.config.onMissingArgument === 'help') {
            if (this.events.fire(new HelpHelperOnInvalidArgumentsShowHelpEvent(event)).halt)
                return;
            this.showHelp(event.config, event.options);
            this.out.nl;
            for (var m in event.parsed.missing) {
                this.log.error("Missing required argument <" + event.parsed.missing[m] + ">");
            }
            return event.stop();
        }
    };
    __decorate([
        inject('cli.events'),
        __metadata("design:type", Dispatcher)
    ], CommandDescriptionHelper.prototype, "events", void 0);
    __decorate([
        inject('cli'),
        __metadata("design:type", Cli)
    ], CommandDescriptionHelper.prototype, "cli", void 0);
    __decorate([
        inject('cli.log'),
        __metadata("design:type", Object)
    ], CommandDescriptionHelper.prototype, "log", void 0);
    __decorate([
        inject('cli.helpers.output'),
        __metadata("design:type", OutputHelper)
    ], CommandDescriptionHelper.prototype, "out", void 0);
    CommandDescriptionHelper = __decorate([
        helper('help', {
            config: {
                app: {
                    title: ''
                },
                addShowHelpCommand: true,
                showOnError: true,
                option: {
                    enabled: false,
                    key: 'h',
                    name: 'help'
                },
                style: {
                    titleLines: 'darkorange',
                    header: 'darkorange bold',
                    group: 'darkcyan bold',
                    grouped: '<%= helpers.help.style.group %>',
                    command: 'steelblue',
                    required: 'green',
                    description: 'darkslategray',
                    desc: '<%= helpers.help.style.description %>',
                    argument: 'yellow darken 25',
                    optional: 'yellow darken 30',
                    array: 'cyan',
                    type: 'yellow'
                },
                templates: {
                    usage: '{header}Usage:{/header}',
                    treeItem: function (config, optionConfigs) { return config.name + " " + config.arguments.map(function (arg) {
                        var name = arg.name;
                        return arg.required ? "<{argument}" + name + "{/argument}>" : "[{optional}" + name + "{/optional}]";
                    }).join(' '); }
                },
                display: {
                    title: true,
                    titleLines: true,
                    description: true,
                    descriptionAsTitle: true,
                    usage: true,
                    example: true,
                    arguments: true,
                    subCommands: true,
                    options: true,
                    globalOptions: true
                }
            },
            listeners: {
                'cli:execute:parse': 'onCommandParse',
                'cli:execute:handle': 'onCommandHandle',
                'cli:execute:invalid': 'onInvalidArguments'
            },
            depends: ['output']
        })
    ], CommandDescriptionHelper);
    return CommandDescriptionHelper;
}());
export { CommandDescriptionHelper };
