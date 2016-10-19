import { Group, group, command, Command } from "../../src";

@command('init', 'Give the current working directory a bit of R.')
export class InitCommand extends Command {
    handle() {
        this.out.success('Success')
    }
}



