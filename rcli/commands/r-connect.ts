import { command, Config, inject, Log, option, Output } from "../../src";

@command('connect', {
    subCommands: [ 'set' ]
})
export default class RcliConnectCmd {

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


    handle(...args: any[]) {
        this.out.line('this is RcliConnectCmd')

        this.out.dump({
            list: this.list,
            add : this.add
        })
    }
}