import { Group, group, command, Command } from "../../src";

@group('git', 'Gi')
export class GitGroup extends Group {
}

@command('init', 'Give the current working directory a bit of R.', GitGroup)
export class GitInitCommand extends Command {

}



