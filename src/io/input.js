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
const BB = require("bluebird");
const inversify_1 = require("inversify");
const inquirer = require("inquirer");
const _ = require("lodash");
const util_1 = require("@radic/util");
let Input = class Input {
    constructor() {
        this.noInteraction = false;
    }
    ask(message, opts = {}) {
        let defer = BB.defer();
        let defaults = { type: 'input', message: message, name: 'question' };
        this.prompt(_.merge(defaults, opts)).then((answers) => {
            defer.resolve(answers.question);
        });
        return defer.promise;
    }
    askSecret(msg, opts = {}) {
        return this.ask(msg, _.merge({}, opts));
    }
    confirm(msg, def = true, opts = {}) {
        return this.ask(msg, _.merge({ default: def }, opts));
    }
    askChoice(msg, choices, multi = false, opts = {}) {
        return this.ask(msg, _.merge({ type: multi ? 'checkbox' : 'list', choices }, opts));
    }
    prompt(prompts) {
        return inquirer.prompt(prompts).catch(console.error.bind(console));
    }
    askArgs(parsed, questions) {
        let args = _.cloneDeep(parsed.arguments);
        var defer = BB.defer();
        let names = Object.keys(questions);
        if (this.noInteraction) {
            defer.resolve(_.pick(args, names));
            return defer.promise;
        }
        let pm = (name, opts) => _.merge({
            name,
            type: 'input',
            message: parsed.definition.getArguments()[name].desc || '',
            when: (answers) => parsed.hasArg(name) === false
        }, opts);
        let prompts = names.map((name) => {
            let question = questions[name];
            if (question.when) {
                let when = question.when;
                question.when = (answers) => {
                    return parsed.hasArg(name) === false && when(answers);
                };
            }
            if (question.type && question.choices && (question.type === 'list' || question.type === 'checkbox')) {
                if (util_1.kindOf(question.choices) === 'function') {
                    let old = question.choices;
                    question.choices = function (answers) {
                        let choices = old(answers);
                        choices.push(new inquirer.Separator());
                        return choices;
                    };
                }
                else {
                    question.choices.push(new inquirer.Separator());
                }
            }
            return pm(name, question);
        });
        return inquirer.prompt(prompts)
            .catch(console.error.bind(console))
            .then((answers) => {
            answers = _.chain(args)
                .pick(names)
                .merge(answers)
                .value();
            defer.resolve(answers);
            return defer.promise;
        });
    }
};
Input = __decorate([
    inversify_1.injectable(), 
    __metadata('design:paramtypes', [])
], Input);
exports.Input = Input;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Input;
//# sourceMappingURL=input.js.map