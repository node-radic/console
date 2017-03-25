import { Command, interfaces, command } from "../../../../src";
import { GitDoGroup } from "./index";


@command('pull', {
    group    : GitDoGroup,
    arguments: {
        name: { desc: 'Project name', type: 'string', required: true }
    }
})
export class GitDoPullCommand extends Command {

}