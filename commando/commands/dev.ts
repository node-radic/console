import { Group, group, Command, command , inject, injectable, BINDINGS } from "../../src";
import {COMMANDO, config} from '../core'
import { ConnectionRepository } from "../services/connection";

@group('dev', 'Dev/Debug Commands', 'Extra commands for debugging and development purposes')
export class DevGroup extends Group {
    handle(){
        if(config('debug') !== true){
            this.fail('Requires debug mode')
        }
    }
}

@injectable()
export class DevCommand extends Command {

    handle(){
        if(config('debug') !== true){
            this.fail('Requires debug mode')
        }
    }
}

@command('con', 'Connections Seeder', 'Add working connections for testing for all remotes.', DevGroup)
export class ConDevCommand extends Command {
    // options: {
    //     g: {alias:'green', desc: 'Show green instead of yellow'}
    // }
    @inject(COMMANDO.CONNECTIONS)
    connections: ConnectionRepository

    handle(){

    }
}
