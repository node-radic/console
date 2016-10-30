"use strict";
const BB = require("bluebird");
const inquirer = require("inquirer");
const _ = require("lodash");
class InteractionCommandHelper {
    get in() {
        return this.command.in;
    }
    get out() {
        return this.command.out;
    }
    setCommand(command) {
        this.command = command;
    }
    getName() {
        return 'interaction';
    }
    askArgs(questions) {
        let args = _.clone(this.command.parsed.arguments);
        var defer = BB.defer();
        let names = Object.keys(questions);
        if (this.command.parsed.args.argv['noInteraction']) {
            defer.resolve(_.pick(args, names));
            return defer.promise;
        }
        let pm = (name, opts) => _.merge({ name, type: 'input', when: (answers) => this.command.hasArg(name) === false }, opts);
        let prompts = names.map((name) => {
            return pm(name, questions[name]);
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
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InteractionCommandHelper;
exports.InteractionCommandHelper = InteractionCommandHelper;
//# sourceMappingURL=interaction.js.map