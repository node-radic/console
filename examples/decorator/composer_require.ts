import { Command , Cli, command , interfaces as i } from "../../src";
import { ComposerGroup } from "./composer";

@command('require', {
    group    : ComposerGroup,
    arguments: {
        name: { desc: 'Project name', type: 'string', required: true }
    }
})
export class ComposerRequireCommand extends Command {
}

