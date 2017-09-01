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
import { kindOf } from "@radic/util";
import { container, injectable, lazyInject } from "./Container";
// import { YargsParserArgv } from "../../types/yargs-parser";
import { CliExecuteCommandEvent, CliExecuteCommandHandledEvent, CliExecuteCommandHandleEvent, CliExecuteCommandInvalidArgumentsEvent, CliExecuteCommandParsedEvent, CliExecuteCommandParseEvent, CliParsedEvent, CliParseEvent, CliPluginRegisterEvent, CliStartEvent, CliPluginRegisteredEvent } from "./events";
import { resolve } from "path";
import * as _ from "lodash";
import { Helpers } from "./Helpers";
import { Dispatcher } from "./Dispatcher";
import * as parser from "yargs-parser";
// import { YargsParserArgv } from "../../types/yargs-parser";
// const parser = require('yargs-parser')
var get = Reflect.getMetadata;
// @singleton('cli')
var Cli = /** @class */ (function () {
    function Cli() {
        this._parsedCommands = [];
        this.globalOptions = [];
        this.parseCommands = true;
    }
    Object.defineProperty(Cli.prototype, "runningCommand", {
        get: function () { return this._runningCommand; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cli.prototype, "rootCommand", {
        get: function () { return this._rootCommand; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cli.prototype, "parsedCommands", {
        get: function () { return this._parsedCommands; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cli.prototype, "transformOptions", {
        get: function () { return container.get('cli.fn.options.transform'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cli.prototype, "parseArguments", {
        get: function () { return container.get('cli.fn.arguments.parse'); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Cli.prototype, "getSubCommands", {
        get: function () { return container.get('cli.fn.commands.get'); },
        enumerable: true,
        configurable: true
    });
    Cli.prototype.configure = function (config) {
        this.config.merge(config);
        return this;
    };
    Cli.prototype.useArgv = function (argv) {
        this._argv = argv;
        return this;
    };
    Object.defineProperty(Cli.prototype, "argv", {
        get: function () {
            return this._argv || process.argv.slice(2);
        },
        enumerable: true,
        configurable: true
    });
    Cli.prototype.start = function (requirePath) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                process
                    .on('unhandledRejection', function (reason, p) {
                    console.error(reason, 'Unhandled sdfRejection at Promise', p);
                })
                    .on('uncaughtException', function (err) {
                    console.error(err, 'Uncaught Exceptifon thrown');
                    process.exit(1);
                });
                requirePath = resolve(requirePath);
                this.events.fire(new CliStartEvent(requirePath)).proceed(function () {
                    _this.helpers.startHelpers();
                    var mod = require(requirePath);
                    var command = Reflect.getMetadata('command', mod.default);
                    command.argv = _this.argv;
                    return _this.parse(command);
                });
                return [2 /*return*/, Promise.resolve()];
            });
        });
    };
    Cli.prototype.parse = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var isRootCommand, transformedOptions, result, subCommands, command;
            return __generator(this, function (_a) {
                if (kindOf(config.action) === 'function') {
                    config.argv = this.argv;
                    return [2 /*return*/, this.executeCommand(config)];
                }
                if (!this.parseCommands) {
                    return [2 /*return*/, Promise.resolve()];
                }
                isRootCommand = !this._rootCommand;
                if (isRootCommand) {
                    this._rootCommand = config;
                }
                if (this.events.fire(new CliParseEvent(config, this.globalOptions, isRootCommand)).stopIfExit().isCanceled())
                    return [2 /*return*/];
                transformedOptions = this.transformOptions(this.globalOptions);
                transformedOptions.configuration = this.config('parser.yargs');
                result = parser(config.argv, transformedOptions);
                this.events.fire(new CliParsedEvent(config, this.globalOptions, isRootCommand, result)).stopIfExit();
                this._parsedCommands.push(config);
                if (config.alwaysRun) {
                    this.events.fire(new CliExecuteCommandEvent(config, config.alwaysRun)).proceed(function () {
                        var instance = container.resolve(config.cls);
                        if (kindOf(instance[config.alwaysRun]) === 'function') {
                            instance[config.alwaysRun].apply(instance, [config.argv]);
                            return Promise.resolve();
                        }
                    });
                }
                if (!this._runningCommand && result._.length > 0 && config.isGroup) {
                    subCommands = this.getSubCommands(config.filePath);
                    if (subCommands[result._[0]]) {
                        command = subCommands[result._[0]];
                        command.argv = config.argv.slice(1);
                        // process.argv.shift();
                        return [2 /*return*/, this.parse(command)];
                    }
                }
                if (!this._runningCommand) {
                    this._runningCommand = config;
                    if (!this.events.fire(new CliExecuteCommandEvent(config, config.alwaysRun)).isCanceled()) {
                        return [2 /*return*/, this.executeCommand(config)];
                    }
                }
                return [2 /*return*/, Promise.resolve()];
            });
        });
    };
    Cli.prototype.executeCommand = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var optionConfigs, transformedOptions, argv, instance, parsed, result_1, md, validate, _a, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        optionConfigs = config.options;
                        // Parse
                        this.events.fire(new CliExecuteCommandParseEvent(config, optionConfigs));
                        transformedOptions = this.transformOptions(this.globalOptions.concat(optionConfigs));
                        transformedOptions.configuration = this.config('parser.yargs');
                        argv = parser(config.argv, transformedOptions);
                        this.events.fire(new CliExecuteCommandParsedEvent(argv, config, optionConfigs));
                        if (kindOf(config.action) === 'function') {
                            config.cls = function () { };
                            container.ensureInjectable(config.cls);
                            config.cls.prototype['handle'] = config.action;
                        }
                        instance = container.resolve(config.cls);
                        // Assign the config itself to the instance, so it's possible to check back on it
                        instance['_config'] = config;
                        instance['_options'] = optionConfigs;
                        // Argument assignment to the instance
                        // Object.assign(instance, _.without(Object.keys(argv), '_'))
                        _.without(Object.keys(argv), '_').forEach(function (argName, argIndex) {
                            instance[argName] = argv[argName];
                        });
                        parsed = this.parseArguments(argv._, config.arguments);
                        this.events.fire(new CliExecuteCommandHandleEvent(instance, parsed, argv, config, optionConfigs)).stopIfExit();
                        // if any missing, execute the way we should handle the arguments.
                        if (!parsed.valid) {
                            this.events.fire(new CliExecuteCommandInvalidArgumentsEvent(instance, parsed, config, optionConfigs)).stopIfExit();
                            if (config.onMissingArgument === "fail") {
                                this.fail("Missing required argument [" + parsed.missing.shift() + "]");
                            }
                            if (config.onMissingArgument === "handle") {
                                if (kindOf(instance['handleInvalid']) === 'function') {
                                    result_1 = instance['handleInvalid'].apply(instance, [parsed, argv]);
                                    if (result_1 === false) {
                                        this.log.error('Not enough arguments given, use the -h / --help option for more information');
                                        process.exit(1);
                                    }
                                }
                            }
                        }
                        if (!(kindOf(instance['validate']) === 'function')) return [3 /*break*/, 3];
                        md = Reflect.getMetadataKeys(instance['validate']).map(function (key) { return Reflect.getMetadata(key, instance['validate']); });
                        console.log(md);
                        validate = instance['validate'].apply(instance, [parsed.arguments, argv]);
                        // if it returns a string, its a failed validation string.
                        if (kindOf(validate) === 'string') {
                            this.fail(validate);
                        }
                        if (!(kindOf(validate) === 'function' && kindOf(validate['then']) === 'function')) return [3 /*break*/, 2];
                        console.log('await validate');
                        _a = parsed;
                        return [4 /*yield*/, validate];
                    case 1:
                        _a.arguments = _b.sent();
                        _b.label = 2;
                    case 2:
                        // If it returns an object, assume its formatted arguments, so we assign em to the eventually passed arguments
                        if (kindOf(validate) === 'object') {
                            parsed.arguments = validate;
                        }
                        _b.label = 3;
                    case 3:
                        result = instance['handle'].apply(instance, [parsed.arguments, argv]);
                        this.events.fire(new CliExecuteCommandHandledEvent(result, instance, argv, config, optionConfigs)).stopIfExit();
                        if (result === null || result === undefined)
                            process.exit();
                        if (result === true)
                            process.exit();
                        if (!(result['then'] !== undefined)) return [3 /*break*/, 5];
                        return [4 /*yield*/, result.then(function (res) {
                                return Promise.resolve(true);
                            }).catch(function (err) {
                                _this.log.error(err);
                                throw new Error(err);
                            })];
                    case 4:
                        result = _b.sent();
                        _b.label = 5;
                    case 5:
                        process.exit(1);
                        return [2 /*return*/];
                }
            });
        });
    };
    Cli.prototype.helper = function (name, config) {
        this.helpers.enable(name, config);
        return this;
    };
    //
    // public helpers(...names: string[]): this {
    //     names.forEach(name => this.helper(name));
    //     return this
    // }
    Cli.prototype.fail = function (msg) {
        if (msg) {
            this.log.error(msg);
        }
        process.exit(1);
    };
    Cli.prototype.global = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var config;
        if (args.length === 1) {
            config = args[0];
        }
        else if (args.length === 2) {
            config = args[1];
            config.key = args[0];
        }
        this.globalOptions.push(config);
        var globalOptions = this.config.get('globalOptions');
        globalOptions.push(config);
        this.config.set('globalOptions', globalOptions);
        return this;
    };
    Cli.prototype.globals = function (configs) {
        var _this = this;
        if (kindOf(configs) === 'object') {
            Object.keys(configs).forEach(function (key) { return _this.global(key, configs[key]); });
            return this;
        }
        configs.forEach(function (config) { return _this.global(config); });
        return this;
    };
    Cli.prototype.use = function (PlugIn, config) {
        var _this = this;
        var plugin = container.resolve(PlugIn);
        var missing = (plugin.depends || []).filter(function (name) {
            return !_this.plugins[name];
        });
        if (missing.length > 0) {
            this.log.warn("Could not load plugin [" + plugin.name + "]. Missing dependencies: " + missing.join(', '));
            return;
        }
        if (this.events.fire(new CliPluginRegisterEvent(plugin, config)).isCanceled())
            return;
        container.constant('plugin.' + plugin.name, plugin);
        plugin.register(config || {}, {
            cli: this,
            config: this.config,
            log: this.log,
            events: this.events,
            helpers: this.helpers,
            container: container
        });
        this.plugins[plugin.name] = plugin;
        this.events.fire(new CliPluginRegisteredEvent(plugin));
    };
    __decorate([
        lazyInject('cli.helpers'),
        __metadata("design:type", Helpers)
    ], Cli.prototype, "helpers", void 0);
    __decorate([
        lazyInject('cli.events'),
        __metadata("design:type", Dispatcher)
    ], Cli.prototype, "events", void 0);
    __decorate([
        lazyInject('cli.log'),
        __metadata("design:type", Object)
    ], Cli.prototype, "log", void 0);
    __decorate([
        lazyInject('cli.config'),
        __metadata("design:type", Function)
    ], Cli.prototype, "config", void 0);
    Cli = __decorate([
        injectable()
    ], Cli);
    return Cli;
}());
export { Cli };
container.constant('cli', new Cli);
export var cli = container.get('cli');
// container.constant('cli', cli) 
