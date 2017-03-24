import { ComposerGroup } from "./groups";
import { Registry, interfaces as i } from "../../src";
export * from './groups'
export * from './git'


@Registry.command('init', {
    arguments: {
        name: { desc: 'Project name', type: 'string', required: true }
    }
})
export class InitCommand implements i.Command {
    arguments: i.Arguments;
    name: string;
    desc: string;
    options: i.Options;
    config: i.CommandConfig;

    handle() {
        console.log({ name: this.name })
    }
}

@Registry.command('require', <i.CommandConfig>{
    group    : ComposerGroup,
    arguments: {
        name: { desc: 'Project name', type: 'string', required: true }
    }
})
export class ComposerRequireCommand {
}

