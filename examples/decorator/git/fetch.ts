import { GitGroup } from "../git";
import { Command, command } from "../../../src";

@command('fetch', {
    group  : GitGroup,
    options: {
        a            : { alias: 'append', desc: 'append to .git/FETCH_HEAD instead of overwriting' },
        'upload-pack': { type: 'string', desc: 'path to upload pack on remote end' }
    }
})
export class GitFetchCommand extends Command {
    name: string
    group: any

    verbose: 0
    help: boolean
    append: boolean
    uploadPack: string
}

