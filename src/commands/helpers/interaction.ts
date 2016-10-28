import * as BB from "bluebird";
import { ICommandHelper, Command } from "../command";
import * as inquirer from "inquirer";
import * as _ from "lodash";
import { IInput, Question } from "../../io/input";
import { IOutput } from "../../io/output";

export default class InteractionCommandHelper implements ICommandHelper {
    protected command: Command

    protected get in():IInput{
        return this.command.in
    }

    protected get out():IOutput {
        return this.command.out
    }

    setCommand(command: Command) {
        this.command = command
    }

    getName(): string {
        return 'interaction';
    }

    askArgs(questions: {[name: string]: Question}) {
        let args: any = _.clone(this.command.parsed.arguments)
        var defer     = BB.defer();
        let names     = Object.keys(questions)

        if ( this.command.parsed.args.argv['noInteraction'] ) {
            defer.resolve(_.pick(args, names)); //['name', 'remote', 'method', 'key', 'secret', 'extra']))
            return defer.promise;
        }

        let pm = (name: string, opts: any) => _.merge({ name, type: 'input', when: (answers: any) => this.command.hasArg(name) === false }, opts)

        let prompts: any[] = names.map((name: string) => {
            return pm(name, questions[ name ])
        })

        return (<any> inquirer.prompt(prompts))
            .catch(console.error.bind(console))
            .then((answers: any) => {
                answers = _.chain(args)
                    .pick(names)
                    .merge(answers)
                    .value();

                defer.resolve(answers);
                return defer.promise
            })
    }


}
export { InteractionCommandHelper }
