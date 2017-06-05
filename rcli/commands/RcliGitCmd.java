import { command, Config, inject, Log, option, Output } from "../../src";

@command('git', 'Adds or edits an existing SSH connection configuration', {

})
export default class RcliGitCmd {

    @inject('cli.helpers.output')
    out: Output;

    @inject('cli.log')
    log: Log;

    @inject('cli.config')
    config: Config;

    @option('l', 'list all connections')
    list: boolean = false;

    @option('a', 'adds connection')
    add: string[];


    @option('g', 'A glob boolean = false')
    global: boolean = false;

    @option('m', 'A man string')
    man: string;

    @option('f', 'A foo number = 5')
    foo: number = 5;


    @option('b', 'Array of booleans', 'boolean')
    arbool: boolean[];

    @option('s', 'Array of string', 'string')
    arstr: string[];


    @option('n', 'Array of number', 'number')
    arnr: number[];


    handle(...args: any[]) {
        this.out.line('this is RcliGitCmd')

        this.out.dump({
            list: this.list,
            add: this.add
        })
    }
}