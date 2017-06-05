import { command, inject, Log, option, Output } from "../../../src";
import { RConfig } from "../../lib";

@command('list', 'list all connections')
export default class RcliConnectListCmd {

    @inject('cli.helpers.output')
    out: Output;

    @inject('cli.log')
    log: Log;

    @inject('config')
    config: RConfig;


    handle(...args: any[]) {

        let cons = this.config.get('connect', {});
        Object.keys(cons).forEach(con => {
            this.out.line(' - ' + con)
        })

    }
}