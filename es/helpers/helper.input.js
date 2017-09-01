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
import { helper } from "../";
import * as inquirer from "inquirer";
import { inject } from "../core/Container";
import * as _ from "lodash";
import { kindOf } from "@radic/util";
var seperator = function (msg) {
    if (msg === void 0) { msg = ''; }
    return new inquirer.Separator(" -=" + msg + "=- ");
};
var InputHelper = /** @class */ (function () {
    function InputHelper() {
    }
    Object.defineProperty(InputHelper.prototype, "types", {
        get: function () { return ['input', 'confirm', 'list', 'rawlist', 'expand', 'checkbox', 'password', 'autocomplete', 'datetime']; },
        enumerable: true,
        configurable: true
    });
    InputHelper.prototype.onExecuteCommandParse = function (event) {
        var promptNames = Object.keys(inquirer.prompts);
        if (!promptNames.includes('autocomplete'))
            inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));
        if (!promptNames.includes('datetime'))
            inquirer.registerPrompt('datetime', require('inquirer-datepicker-prompt'));
        if (kindOf(this.config.registerPrompts) === 'function') {
            this.config.registerPrompts(inquirer);
        }
    };
    InputHelper.prototype.ask = function (message, def) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prompt({ default: def, type: 'input', message: message })];
            });
        });
    };
    InputHelper.prototype.confirm = function (message, def) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prompt({ type: 'confirm', default: def, message: message })];
            });
        });
    };
    InputHelper.prototype.list = function (msg, choices, validate) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.multiple(msg, 'list', choices, validate)];
            });
        });
    };
    InputHelper.prototype.rawlist = function (msg, choices, validate) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.multiple(msg, 'rawlist', choices, validate)];
            });
        });
    };
    InputHelper.prototype.expand = function (msg, choices, validate) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.multiple(msg, 'expand', choices, validate)];
            });
        });
    };
    InputHelper.prototype.checkbox = function (msg, choices, validate) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.multiple(msg, 'checkbox', choices, validate)];
            });
        });
    };
    InputHelper.prototype.password = function (message, def, validate) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prompt({ type: 'password', default: def, message: message, validate: validate })];
            });
        });
    };
    InputHelper.prototype.autocomplete = function (message, source, suggestOnly, validate) {
        if (suggestOnly === void 0) { suggestOnly = false; }
        return __awaiter(this, void 0, void 0, function () {
            var src;
            return __generator(this, function (_a) {
                src = source;
                if (kindOf(source) === 'array') {
                    src = function (answersSoFar, input) {
                        return Promise.resolve(source.filter(function (name) {
                            return name.startsWith(input);
                        }));
                    };
                }
                return [2 /*return*/, this.prompt({ type: 'autocomplete', message: message, source: src, suggestOnly: suggestOnly, validate: validate })];
            });
        });
    };
    /**
     *
     * @link https://github.com/DerekTBrown/inquirer-datepicker-prompt
     * @link https://www.npmjs.com/package/dateformat
     *
     * @returns {Promise<string>}
     */
    InputHelper.prototype.datetime = function (message, date, time, format) {
        if (format === void 0) { format = ['d', '/', 'm', '/', 'yyyy', ' ', 'HH', ':', 'MM', ':', 'ss']; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.prompt({ type: 'datetime', message: message, date: date, time: time, format: format })];
            });
        });
    };
    InputHelper.prototype.multiple = function (message, type, choices, validate) {
        return __awaiter(this, void 0, void 0, function () {
            var prompt;
            return __generator(this, function (_a) {
                prompt = { type: type, message: message, choices: choices };
                if (validate) {
                    prompt['validate'] = validate;
                }
                return [2 /*return*/, this.prompt(prompt)];
            });
        });
    };
    InputHelper.prototype.prompts = function (questions) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, inquirer.prompt(questions)];
            });
        });
    };
    InputHelper.prototype.prompt = function (question) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                question.name = 'prompt';
                return [2 /*return*/, inquirer.prompt([question])
                        .then(function (answers) { return Promise.resolve(answers.prompt); })
                        .catch(function (e) { return Promise.reject(e); })];
            });
        });
    };
    InputHelper.prototype.interact = function (message, type, opts, def) {
        if (type === void 0) { type = 'input'; }
        if (opts === void 0) { opts = {}; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var question = _.merge({ name: 'ask', message: message, type: type, default: def }, opts);
                        inquirer.prompt(question).then(function (answers) { return resolve(answers.ask); }).catch(function (e) { return reject(e); });
                    })];
            });
        });
    };
    __decorate([
        inject('cli.config'),
        __metadata("design:type", Function)
    ], InputHelper.prototype, "_config", void 0);
    InputHelper = __decorate([
        helper('input', {
            singleton: true,
            config: {
                registerPrompts: function (inquirer) { }
            },
            listeners: {
                'cli:execute:parse': 'onExecuteCommandParse'
            }
        })
    ], InputHelper);
    return InputHelper;
}());
export { InputHelper };
