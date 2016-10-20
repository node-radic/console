import { Group, group, command, Command } from "../../src";

@group('git', 'Git Helpers', 'Gi')
export class GitGroup extends Group {
}

@command('init', 'Initialize Git project', 'Give the current working directory a bit of R.', GitGroup)
export class GitInitCommand extends Command {

}



