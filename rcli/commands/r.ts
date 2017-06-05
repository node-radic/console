import { command, inject, Log, Output } from "../../src";
@command({
    subCommands: [ 'connect' ]
})
export default class RcliCmd {

    @inject('cli.helpers.output')
    out: Output;

    @inject('cli.log')
    log: Log;

    handle(...args: any[]) {
        // this.out.dump(this)
        // this.out.success('asdf')
        this.out.line('this is RcliCmd')

        this.log.info('This is a info log')
        this.log.debug('This is a debug log')
        this.log.silly('This is a silly log')
    }
}