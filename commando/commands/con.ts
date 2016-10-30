// export * from './connection'
import { Group, group, Command } from "../../src";
import { injectable, inject, COMMANDO } from "../core";
import { RemoteFactory, IRemoteRegistration, ConnectionRepository } from "../services";



@group('con', 'Connection Manager', 'Define connections to remote jenkins, jira, git, etc')
export class ConnectionGroup extends Group {
    @inject(COMMANDO.REMOTES)
    remotes: RemoteFactory

    handle() {
        this.showHelp('Connection Manager')
        this.out.header('Available Remotes')
        let table = this.out.columns()
        this.remotes.values().forEach((remote: IRemoteRegistration) => {
            table.push([
                `{skyblue}${remote.prettyName}{/skyblue}`,
                `{grey}${remote.name}{/grey}`
            ])
        })
        this.out.writeln(table.toString());
    }
}

@injectable()
export abstract class ConnectionCommand extends Command {

    @inject(COMMANDO.CONNECTIONS)
    connections: ConnectionRepository

    @inject(COMMANDO.REMOTES)
    remotes: RemoteFactory

    handle() {
        this.out.line(`This is the {green}con ${this.name}{/green} command`)
    }

}
