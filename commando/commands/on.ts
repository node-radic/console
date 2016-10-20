import { Group, group, command, Command } from "../../src";

@group('on', 'Remote Communicator',  'Use a defined connections to communicate with remotes')
export class OnGroup extends Group {
}

@command('list', 'sd', 'Give the current working directory a bit of R.', OnGroup)
export class ListOnCommand extends Command {

}



