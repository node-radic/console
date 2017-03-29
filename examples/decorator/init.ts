import { ComposerGroup } from "./composer";
import { Command, command, interfaces as i } from "../../src";


@command('init', {
    arguments: {
        name: { desc: 'Project name', type: 'string', required: true }
    }
})
export class InitCommand extends Command {

    handle() {
        console.log({ name: this.name })
    }
}
