import { command, CommandArguments, option, Input, lazyInject, Log, Output } from "../../../src";

@command(`add 
{name:string@the connection name} 
{host:string@the host to connect}
[user/users:string[]@the user to login] 
[method:string[]@the connect method]`
    , 'Add a connection')
export class RcliConnectAddCmd {

    @lazyInject('cli.helpers.output')
    out: Output;

    @lazyInject('cli.helpers.input')
    ask: Input;

    @lazyInject('cli.log')
    log: Log;


    @option('P', 'login using a password')
    pass:string

    @option('p', 'use the given port (default: 22)')
    port:number = 22

    @option('l', 'local mount path for sshfs (default: /mnt/<name>)')
    localPath:string

    @option('h', 'host path to mount for sshfs (default: / )')
    hostPath:string

    handle(args: CommandArguments, ...argv: any[]) {
        let add = {
            name: args.name,
            user: args.user,
            host: args.host,
            method: 'key',
            port: this.port,
            localPath: '/mnt/' + args.name,
            hostPath: '/'
        }
    }

}
export default RcliConnectAddCmd