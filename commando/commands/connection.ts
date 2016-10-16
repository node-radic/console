// export * from './connection'
import { Group, group, command, Command } from "../../src";
import {injectable,inject, COMMANDO} from '../core'
import { IConnectionRepository } from "../services";

@group('con', 'Connection manager. Connect to jenkins, jira, git, etc')
export class ConnectionGroup extends Group {
    handle(){
        this.showHelp()
    }
}

@injectable()
export abstract class ConnectionCommand extends Command {

    @inject(COMMANDO.CONNECTIONS)
    connections: IConnectionRepository

    handle(){
        this.out.line(`This is the {green}con ${this.name}{/green} command`)
    }
}


@command('add', 'Add a new connection', ConnectionGroup)
export class AddConnectionCommand extends ConnectionCommand {
    arguments = {
        name: {description: 'The name of the connection', required: true}
    }
    handle(){

    }
}
@command('list', 'List all connections', ConnectionGroup)
export class ListConnectionCommand extends ConnectionCommand {
}
@command('rm', 'Remove a connection', ConnectionGroup)
export class RemoveConnectionCommand extends ConnectionCommand {
}
@command('cp', 'Create a new connection based on an existing one', ConnectionGroup)
export class CopyConnectionCommand extends ConnectionCommand {
}
@command('edit', 'Edit a existing connection', ConnectionGroup)
export class EditConnectionCommand extends ConnectionCommand {
}

