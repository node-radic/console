import { ComposerGroup } from "./composer";
import { Command, command, interfaces as i } from "../../src";
export * from './composer'
export * from './git'


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
