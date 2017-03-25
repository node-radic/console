import { Command , Cli, command , interfaces as i } from "../../src";

const cli = Cli.getInstance();
export const ComposerGroup = cli.group('composer');

@command('require', {
    group    : ComposerGroup,
    arguments: {
        name: { desc: 'Project name', type: 'string', required: true }
    }
})
export class ComposerRequireCommand extends Command {
}

