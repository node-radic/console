import { command, inject, Log, option, Output } from "../../../src";
import { RConfig } from "../../lib";

@command('show', 'set a connections')
export default class RcliConnectSetCmd {

    @inject('cli.helpers.output')
    out: Output;

    @inject('cli.log')
    log: Log;

    @inject('config')
    config: RConfig;


    handle(...args: any[]) {


    }
}