import { Cli, Registry, interfaces as i } from "../../src";
import { GitGroup, GitDoGroup } from "./groups";


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



@Registry.command('pull', {
    group    : GitDoGroup,
    arguments: {
        name: { desc: 'Project name', type: 'string', required: true }
    }
})
export class GitDoPullCommand {

}