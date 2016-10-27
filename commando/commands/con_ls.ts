// export * from './connection'
import { command } from "../../src";
import { AuthMethod, Connection } from "../services";
import InteractionCommandHelper from "../../src/commands/helpers/interaction";
import { ConnectionGroup, ConnectionCommand } from "./con";
import { inspect } from "util";


@command('ls', 'List connections', 'List connections or remotes', ConnectionGroup)
export class ListConnectionCommand extends ConnectionCommand {
    handle(){
        super.handle()
        let table = this.out.columns(['Name', 'Remote', 'Auth Method', 'Extra'])
        this.connections.all().forEach((con:Connection) => {
            table.push([con.name, con.remote, con.method, inspect(con.extra, {colors: false, depth: 1, showHidden: false })])
        })
        this.out.writeln(table.toString())
    }
}

