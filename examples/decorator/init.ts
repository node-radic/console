import { Command, command} from "../../src";


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
