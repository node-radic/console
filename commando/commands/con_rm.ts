// export * from './connection'
import { command } from "../../src";
import { AuthMethod } from "../services";
import InteractionCommandHelper from "../../src/commands/helpers/interaction";
import { ConnectionGroup, ConnectionCommand } from "./con";
import { IArgumentDefinition } from "../../src/definitions";




@command('rm', 'Remove connection', 'Remove a connection', ConnectionGroup)
export class RemoveConnectionCommand extends ConnectionCommand {

    arguments = {
        name: <IArgumentDefinition> { desc: 'The name of the connection'}
    }

    handle(){
        let m = this.connections.model({
            name: 'asdf',
            remote: 'fff'
        });

        let v = m.validate();

        let pass = v.passes()

        let errors = v.errors

        if(pass){
            m.save();
        }
    }

    handle2() {
        this.askArgs({
            name: { type: 'list', message: 'Pick connections', choices: (answers:any) => this.connections.query.map('names').value<string[]>() }
        }).then((args:any) => {
            this.out.dump(args)
        })

    }
}
