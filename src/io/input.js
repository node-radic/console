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
var BB = require("bluebird");
var inversify_1 = require("inversify");
var inquirer = require("inquirer");
var _ = require("lodash");
var Input = (function () {
    function Input() {
        this.noInteraction = false;
    }
    Input.prototype.ask = function (message, opts) {
        if (opts === void 0) { opts = {}; }
        var defer = BB.defer();
        var defaults = { type: 'input', message: message, name: 'question' };
        this.prompt(_.merge(defaults, opts)).then(function (answers) {
            defer.resolve(answers.question);
        });
        return defer.promise;
    };
    Input.prototype.askSecret = function (msg, opts) {
        if (opts === void 0) { opts = {}; }
        return this.ask(msg, _.merge({}, opts));
    };
    Input.prototype.confirm = function (msg, def, opts) {
        if (def === void 0) { def = true; }
        if (opts === void 0) { opts = {}; }
        return this.ask(msg, _.merge({ default: def }, opts));
    };
    Input.prototype.askChoice = function (msg, choices, multi, opts) {
        if (multi === void 0) { multi = false; }
        if (opts === void 0) { opts = {}; }
        return this.ask(msg, _.merge({ type: multi ? 'checkbox' : 'list', choices: choices }, opts));
    };
    Input.prototype.prompt = function (prompts) {
        return inquirer.prompt(prompts).catch(console.error.bind(console));
    };
    Input.prototype.askArgs = function (parsed, questions) {
        var args = _.clone(parsed.arguments);
        var defer = BB.defer();
        var names = Object.keys(questions);
        if (this.noInteraction) {
            defer.resolve(_.pick(args, names));
            return defer.promise;
        }
        var pm = function (name, opts) { return _.merge({ name: name, type: 'input', when: function (answers) { return parsed.hasArg(name) === false; } }, opts); };
        var prompts = names.map(function (name) {
            return pm(name, questions[name]);
        });
        return inquirer.prompt(prompts)
            .catch(console.error.bind(console))
            .then(function (answers) {
            answers = _.chain(args)
                .pick(names)
                .merge(answers)
                .value();
            defer.resolve(answers);
            return defer.promise;
        });
    };
    Input = __decorate([
        inversify_1.injectable(), 
        __metadata('design:paramtypes', [])
    ], Input);
    return Input;
}());
exports.Input = Input;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Input;
//# sourceMappingURL=input.js.map