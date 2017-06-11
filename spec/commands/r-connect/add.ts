import { command, Input, lazyInject, Log, Output } from "../../../src";
import { CommandArguments } from "../../../src/interfaces";

@command(`add 
{name:string@the connection name} 
[host:string@the host to connect]
[user/users:string[]@the user to login] 
[method:string[]@the connect method]`
    , 'Add a connection')
export class RcliConnectAddCmd {

    @lazyInject('cli.helpers.output')
    out: Output;

    @lazyInject('cli.helpers.input')
    ask: Input;

    @lazyInject('cli.log')
    lazyInject: Log;



    async handle(args: CommandArguments, ...argv: any[]) {

    }
}
export default RcliConnectAddCmd