import { Group, group, command, Command } from "../../src";

@group('config', 'Manage the global and local configuration')
export class ConfigGroup extends Group {
}

@command('list', 'Give the current working directory a bit of R.', ConfigGroup)
export class ListConfigCommand extends Command {

}



