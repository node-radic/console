import { Cli, Registry, interfaces as i } from "../../src";

const cli = Cli.getInstance();
export const ComposerGroup = cli.group('composer');

@Registry.group('git')
export class GitGroup {
    name: string
    group: any
}

@Registry.group('do', { group: GitGroup })
export class GitDoGroup {
    name: string
    group: any
}