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
        inquirer.prompt([
            _.merge(defaults, opts)
        ])['then'](function (answers) {
            defer.resolve(answers.question);
        });
        return defer.promise;
    };
    Input.prototype.askArgs = function (questions, argv) {
        var defer = BB.defer();
        var names = Object.keys(questions);
        if (argv.noInteraction) {
            defer.resolve(_.pick(argv, names));
            return defer.promise;
        }
        var pm = function (name, opts) { return _.merge({
            name: name,
            when: function (answers) { return !argv._[name]; }
        }, opts); };
        var prompts = names.map(function (name) {
            return pm(name, questions[name]);
        });
        return this.prompt(prompts).then(function (args) {
            args = _.chain(argv)
                .pick(names)
                .merge(args)
                .value();
            defer.resolve(args);
            return defer.promise;
        });
    };
    Input.prototype.prompt = function (prompts) {
        return inquirer.prompt(prompts);
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