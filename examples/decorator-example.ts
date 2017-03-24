import { Cli, Registry, interfaces as i } from "../src";

const cli = Cli.getInstance();
cli.config({ mode: 'groups' })
cli.options({
    v: { alias: 'verbose', desc: 'be more verbose', global: true, count: 3 },
    h: { alias: 'help', desc: 'shows help', global: true }
})

const ComposerGroup = cli.group('composer');

@Registry.command('init', {
    arguments: {
        name: { desc: 'Project name', type: 'string', required: true }
    }
})
export class InitCommand {

}


@Registry.group('git')
export class GitGroup {
    name: string
    group: any
}


@Registry.command('fetch', {
    group  : GitGroup,
    options: {
        a            : { alias: 'append', desc: 'append to .git/FETCH_HEAD instead of overwriting' },
        'upload-pack': { type: 'string', desc: 'path to upload pack on remote end' }
    }
})
export class GitFetchCommand {
    name: string
    group: any

    verbose: 0
    help: boolean
    append: boolean
    uploadPack: string
}


@Registry.group('do', { group: GitGroup })
export class GitDoGroup {
    name: string
    group: any
}

@Registry.command('pull', {
    group    : GitDoGroup,
    arguments: {
        name: { desc: 'Project name', type: 'string', required: true }
    }
})
export class GitDoPullCommand {

}

@Registry.command('require', <i.CommandConfig>{
    group    : ComposerGroup,
    arguments: {
        name: { desc: 'Project name', type: 'string', required: true }
    }
})
export class ComposerRequireCommand {

}




const tree = cli.parse('git 123312 -a -vv'.split(' '));

cli.dump(tree);