import { command, inject, Log, option, Output } from "../../../src";
import { RConfig } from "../../lib";

@command('add {name|key:the connection name} {user} {host}', 'add a connection')
export default class RcliConnectAddCmd {

    @inject('cli.helpers.output')
    out: Output;

    @inject('cli.log')
    log: Log;

    @inject('config')
    config: RConfig;
    @option('p', 'server ssh port')
    port: string

    @option('m', 'method of connecting (key|password)')
    method: string;

    @option('L', 'path to local mount point (sshfs)')
    mountLocal: string;

    @option('R', 'path on the remote server to mount (sshfs)')
    mountRemote: string;


    handle(args: { [name: string]: any }, ...argv: any[]) {

        this.out.dump({args, argv});
    }
}