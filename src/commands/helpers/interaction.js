"use strict";
var BB = require("bluebird");
var inquirer = require("inquirer");
var _ = require("lodash");
var InteractionCommandHelper = (function () {
    function InteractionCommandHelper() {
    }
    Object.defineProperty(InteractionCommandHelper.prototype, "in", {
        get: function () {
            return this.command.in;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InteractionCommandHelper.prototype, "out", {
        get: function () {
            return this.command.out;
        },
        enumerable: true,
        configurable: true
    });
    InteractionCommandHelper.prototype.setCommand = function (command) {
        this.command = command;
    };
    InteractionCommandHelper.prototype.getName = function () {
        return 'interaction';
    };
    InteractionCommandHelper.prototype.askArgs = function (questions) {
        var _this = this;
        var args = _.clone(this.command.parsed.arguments);
        var defer = BB.defer();
        var names = Object.keys(questions);
        if (this.command.parsed.args.argv['noInteraction']) {
            defer.resolve(_.pick(args, names));
            return defer.promise;
        }
        var pm = function (name, opts) { return _.merge({ name: name, type: 'input', when: function (answers) { return _this.command.hasArg(name) === false; } }, opts); };
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
    return InteractionCommandHelper;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InteractionCommandHelper;
exports.InteractionCommandHelper = InteractionCommandHelper;
//# sourceMappingURL=interaction.js.map