var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
import { kindOf, stringify } from "@radic/util";
import { helper } from "../decorators";
import { bindTo, container, inject } from "../core/Container";
import { OutputHelper } from "./helper.output";
import { Cli } from "../core/Cli";
import { Dispatcher } from "../core/Dispatcher";
import { HelpHelperOnInvalidArgumentsShowHelpEvent, HelpHelperShowHelpEvent } from "./events";
import * as _ from "lodash";
var HelpHelper = /** @class */ (function () {
    function HelpHelper() {
    }
    HelpHelper.prototype.createDescriber = function (command) {
        var describer = container.get('cli.helpers.help.describer');
        describer.command = command;
        return describer;
    };
    Object.defineProperty(HelpHelper.prototype, "getSubCommands", {
        get: function () { return container.get('cli.fn.commands.get'); },
        enumerable: true,
        configurable: true
    });
    HelpHelper.prototype.showHelp = function (config, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var describer;
            return __generator(this, function (_a) {
                if (config.helpers['help']) {
                    _.merge(this.config, config.helpers['help']);
                }
                this.events.fire(new HelpHelperShowHelpEvent(config, options));
                describer = this.createDescriber(config);
                this.config.order.forEach(function (item, i) {
                    if (kindOf(_this.config.overrides[item]) === 'function') {
                        return _this.config.overrides[item](config, describer, _this);
                    }
                    describer[item]();
                });
                return [2 /*return*/];
            });
        });
    };
    HelpHelper.prototype.printCommandTree = function (label, config) {
        if (label === void 0) { label = 'Command tree:'; }
        this.out.tree(label, this.getTreeSubcommands(this.cli.rootCommand || config || {}));
    };
    HelpHelper.prototype.getTreeSubcommands = function (config) {
        var _this = this;
        var obj = this.getSubCommands(config.filePath);
        return Object.keys(obj).map(function (subCommand) {
            // let filePath                 = obj[ subCommand ].filePath
            // let subConfig: CommandConfig = obj[ subCommand ];
            //
            // let optionConfigs: OptionConfig[] = Reflect.getMetadata('options', subConfig.cls.prototype) || [];
            // if ( subConfig.isGroup ) {
            //     subConfig.subCommands = Object.keys(getSubCommands(config.filePath))
            // }
            // if ( subConfig.subCommands && subConfig.subCommands.length > 0 ) {
            //     return { label: this.config.templates.treeItem(subConfig, optionConfigs), nodes: this.getTreeSubcommands(subConfig) }
            // }
            return _this.config.templates.treeItem(subCommand, Reflect.getMetadata('options', subCommand['cls'].prototype));
        });
    };
    HelpHelper.prototype.getSubcommandsNameTree = function (config) {
        var obj = {};
        //
        // config.subCommands.map(subCommand => {
        //     let filePath = findSubCommandFilePath(subCommand, config.filePath)
        //     let module   = require(filePath);
        //     if ( kindOf(module.default) === 'function' ) {
        //         let subConfig: CommandConfig      = Reflect.getMetadata('command', module.default);
        //         let optionConfigs: OptionConfig[] = Reflect.getMetadata('options', subConfig.cls.prototype) || [];
        //         if ( subConfig.subCommands && subConfig.subCommands.length > 0 ) {
        //             return { [subConfig.name]: this.getSubcommandsNameTree(subConfig) }
        //         }
        //
        //         return { [subConfig.name]: optionConfigs.map(opt => '--' + opt.name) };
        //     }
        //     return false;
        // }).filter(subConfig => subConfig !== false).forEach(subj => {
        //     _.merge(obj, subj);
        // });
        return obj;
    };
    HelpHelper.prototype.onCommandParse = function (event) {
        if (this.config.option.enabled === true) {
            event.cli.global(this.config.option.key, {
                name: this.config.option.name,
                type: 'boolean',
                description: 'show help'
            });
        }
    };
    HelpHelper.prototype.onCommandHandle = function (event) {
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
                    return event.exit();
                }
                this.showHelp(event.config, event.options);
                return event.exit();
            }
        }
    };
    HelpHelper.prototype.onInvalidArguments = function (event) {
        if (this.config.showOnError === true && event.config.onMissingArgument === 'help') {
            if (this.events.fire(new HelpHelperOnInvalidArgumentsShowHelpEvent(event)).stopIfExit().isCanceled())
                return;
            this.showHelp(event.config, event.options);
            this.out.nl;
            for (var m in event.parsed.missing) {
                this.log.error("Missing required argument <" + event.parsed.missing[m] + ">");
            }
            return event.exit();
        }
    };
    __decorate([
        inject('cli.events'),
        __metadata("design:type", Dispatcher)
    ], HelpHelper.prototype, "events", void 0);
    __decorate([
        inject('cli'),
        __metadata("design:type", Cli)
    ], HelpHelper.prototype, "cli", void 0);
    __decorate([
        inject('cli.log'),
        __metadata("design:type", Object)
    ], HelpHelper.prototype, "log", void 0);
    __decorate([
        inject('cli.helpers.output'),
        __metadata("design:type", OutputHelper)
    ], HelpHelper.prototype, "out", void 0);
    HelpHelper = __decorate([
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
                    grouped: 'darkcyan bold',
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
                order: [
                    'usage',
                    'description',
                    'explanation',
                    'groups',
                    'commands',
                    'arguments',
                    'options',
                    'globalOptions',
                    'example'
                ],
                headers: {
                    usage: '{header}Usage: {/header}',
                    description: '{header}Description: {/header}\n',
                    explanation: '{header}Explanation: {/header}\n',
                    groups: '{header}Groups: {/header}\n',
                    commands: '{header}Commands: {/header}\n',
                    arguments: '{header}Arguments: {/header}\n',
                    options: '{header}Options: {/header}\n',
                    globalOptions: '{header}Global options: {/header}\n',
                    example: '{header}Example: {/header}\n',
                },
                overrides: {
                    usage: null,
                    description: null,
                    explanation: null,
                    groups: null,
                    commands: null,
                    arguments: null,
                    options: null,
                    globalOptions: null,
                    example: null,
                },
                display: {
                    title: true,
                    titleLines: true,
                    explanation: true,
                    description: true,
                    descriptionAsTitle: false,
                    usage: true,
                    usageOnGroups: false,
                    example: true,
                    arguments: true,
                    options: true,
                    globalOptions: true,
                    commands: true,
                    groups: true
                }
            },
            listeners: {
                'cli:execute:parse': 'onCommandParse',
                'cli:execute:handle': 'onCommandHandle',
                'cli:execute:invalid': 'onInvalidArguments'
            },
            depends: ['output']
        })
    ], HelpHelper);
    return HelpHelper;
}());
export { HelpHelper };
container.bind('cli.helpers.help.describer.factory').toFactory(function (ctx) {
    return function (command) { return __awaiter(_this, void 0, void 0, function () {
        var describer;
        return __generator(this, function (_a) {
            describer = ctx.container.get('cli.helpers.help.describer');
            describer.command = command;
            return [2 /*return*/, describer];
        });
    }); };
});
var CommandDescriber = /** @class */ (function () {
    function CommandDescriber() {
        this.command = null;
    }
    Object.defineProperty(CommandDescriber.prototype, "config", {
        get: function () {
            return this.help.config;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandDescriber.prototype, "display", {
        get: function () {
            return this.config.display;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CommandDescriber.prototype, "nl", {
        get: function () {
            this.write('\n');
            return this;
        },
        enumerable: true,
        configurable: true
    });
    CommandDescriber.prototype.write = function (text) {
        this.out.write(text);
        return this;
    };
    CommandDescriber.prototype.line = function (text) {
        if (text === void 0) { text = ''; }
        this.out.line(text);
        return this;
    };
    CommandDescriber.prototype.columns = function (data, options) {
        if (options === void 0) { options = {}; }
        return this.write(this.out.columns(data, options, true));
    };
    CommandDescriber.prototype.usage = function () {
        if (!this.display.usage)
            return this;
        var config = this.command, usage = config.usage || '', name = config.name;
        if (usage.length === 0 && config.arguments.length > 0) {
            usage = this.help.cli.parsedCommands.map(function (cmd) { return cmd.name; }).join(' ');
            usage += ' ';
            usage += config.arguments.map(function (arg) {
                name = arg.name + (arg.alias ? '|' + arg.alias : '');
                return arg.required ? '<' + name + '>' : '[' + name + ']';
            }).join(' ');
        }
        usage += ' [...options]';
        return this.write(this.config.headers.usage).write(usage).nl.nl;
    };
    CommandDescriber.prototype.arguments = function () {
        if (this.command.isGroup || !this.display.arguments || this.command.arguments.length === 0)
            return this;
        var rows = [];
        this.command.arguments.forEach(function (arg) {
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
            if (arg.required) {
                type += ' [{required}required{/required}]';
            }
            row.push(type);
            rows.push(row); //[ arg.name, arg.desc, arg.type, arg.variadic, arg.required ])
        });
        if (rows.length === 0)
            return this;
        return this.write(this.config.headers.arguments).columns(rows, {
            columnSplitter: '  ',
            showHeaders: false,
            preserveNewLines: true
        }).nl.nl;
    };
    CommandDescriber.prototype.commands = function () {
        if (!this.command.isGroup || !this.display.commands)
            return this;
        var rows = [];
        this.help.getSubCommands(this.command.filePath, false, true).forEach(function (command) {
            var type = command.isGroup ? 'grouped' : 'command';
            if (command.isGroup)
                return;
            rows.push(["{command}" + command.name + "{/command}", "{desc}" + command.description + "{/desc}"]);
        });
        if (rows.length === 0)
            return this;
        return this.write(this.config.headers.commands).columns(rows, {
            columnSplitter: '   ',
            showHeaders: false,
            preserveNewLines: true
        }).nl.nl;
    };
    CommandDescriber.prototype.groups = function () {
        if (!this.command.isGroup || !this.display.commands)
            return this;
        var rows = [];
        this.help.getSubCommands(this.command.filePath, false, true).forEach(function (command) {
            if (!command.isGroup)
                return;
            rows.push(["{grouped}" + command.name + "{/grouped}", "{desc}" + command.description + "{/desc}"]);
        });
        if (rows.length === 0)
            return this;
        return this.write(this.config.headers.groups).columns(rows, {
            columnSplitter: '   ',
            showHeaders: false,
            preserveNewLines: true
        }).nl.nl;
    };
    CommandDescriber.prototype.globalOptions = function () {
        if (!this.display.globalOptions || this.help.cli['globalOptions'].length === 0)
            return this;
        return this.write(this.config.headers.globalOptions).printOptions(this.help.cli['globalOptions']).nl.nl;
    };
    CommandDescriber.prototype.options = function () {
        if (!this.display.options || this.command.options.length === 0)
            return this;
        return this.write(this.config.headers.options).printOptions(this.command.options).nl.nl;
    };
    CommandDescriber.prototype.description = function () {
        if (!this.display.description || this.command.description.length === 0)
            return this;
        return this.write(this.config.headers.description).write(this.command.description).nl.nl;
    };
    CommandDescriber.prototype.explanation = function () {
        if (!this.display.explanation || !this.command.explanation)
            return this;
        return this.write(this.config.headers.explanation).write(this.command.explanation).nl.nl;
    };
    CommandDescriber.prototype.example = function () {
        if (!this.display.example || !this.command.example)
            return this;
        return this.write(this.config.headers.example).write(this.command.example).nl.nl;
    };
    CommandDescriber.prototype.printOptions = function (options) {
        var rows = [];
        var s = this.help.config.styles;
        options.forEach(function (option) {
            // Format description
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
            // Format type
            var type = option.type;
            if (type === undefined && option.count) {
                type = 'count';
            }
            type = "{type}" + type + "{/type}";
            if (option.array) {
                type = "{cyan}Array<{/cyan}" + type + "{cyan}>{/cyan}";
            }
            if (option.default) {
                type += '=' + stringify(option.default);
            }
            type = '[' + type + ']';
            // Format key
            var name = option.name;
            var hasName = !!name;
            var key = '-' + option.key + (name ? '|--' + name : '');
            if (option.arguments > 0) {
            }
            if (option.default) {
                // type = `[default=${JSON.stringify(option.default)}] ${type}`
            }
            var columns = [
                key,
                desc,
                type
            ];
            rows.push(columns);
        });
        return this.columns(rows, {
            columnSplitter: '   ',
            showHeaders: false,
            preserveNewLines: true
        });
    };
    __decorate([
        inject('cli.helpers.help'),
        __metadata("design:type", HelpHelper)
    ], CommandDescriber.prototype, "help", void 0);
    __decorate([
        inject('cli.helpers.output'),
        __metadata("design:type", OutputHelper)
    ], CommandDescriber.prototype, "out", void 0);
    CommandDescriber = __decorate([
        bindTo('cli.helpers.help.describer')
    ], CommandDescriber);
    return CommandDescriber;
}());
export { CommandDescriber };
