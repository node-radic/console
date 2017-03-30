import { group, Group, command, Command } from "../../src";
import { GitGroup } from "./git";
import * as S from "string";
import { interfaces as i, inject } from "../../src";
import { Registry } from "../../src/core/registry";
import { Cli } from "../../src/core/cli";


@command('fetch', {
    group    : GitGroup,
    options  : {
        a            : { alias: 'append', desc: 'append to .git/FETCH_HEAD instead of overwriting' },
        'upload-pack': { type: 'string', desc: 'path to upload pack on remote end' }
    },
    arguments: {
        remote: { required: true, type: 'string', desc: 'The target remote' },
        branch: { type: 'string', desc: 'The branch ' }
    }
})
export class GitFetchCommand {
    name: string
    group: any
    options: i.Options
    arguments: i.Arguments

    verbose: number
    help: boolean

    append: boolean
    uploadPack: string

    remote:string
    branch:string


    constructor(@inject('console.cli') private cli: Cli,) {}

    handle() {
        console.log('a', this);


        // 'upload-pack-es'.split('-').map((part) => S(part).titleCase());
        console.log({ 'u': S('upload-pack').camelize().toString() });
    }
}

