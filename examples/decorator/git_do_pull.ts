import { group, Group, command, Command } from "../../src";
import { GitDoGroup } from "./git_do";


@command('pull', {
    group    : GitDoGroup,
    arguments: {
        name: { desc: 'Project name', type: 'string', required: true }
    }
})
export class GitDoPullCommand extends Command {

}