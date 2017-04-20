import { group, Group, command, Command } from "../../src";
import { GitGroup } from "./git";
import * as S from "string";
import { interfaces as i, inject } from "../../src";
import Registry from "../../src/core/Registry";
import { Cli } from "../../src/core/cli";
import Output from "../../src/helpers/Output";
import Describer from "../../src/helpers/Describer";


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

    _config: i.CommandConfig
    verbose: number
    help: boolean

    append: boolean
    uploadPack: string

    remote: string
    branch: string


    constructor(@inject('console.cli') public cli: Cli,
                @inject('console.helpers.output') public out: Output,
                @inject('console.helpers.describer') public describer: Describer
    ) {}

    handle() {

        this.out.writeln('{orange}Overview{/orange}');

        if(this.help){
            let help = [ this.describer.options(this._config.options) ].join('\n')
            this.out.writeln(help);
            process.exit();
        }

        // 'upload-pack-es'.split('-').map((part) => S(part).titleCase());
        console.log({ 'u': S('upload-pack').camelize().toString() });

        this.out.success('Works good !!').nl.line('Continue like this..');

    }


    writeColumns(data) {
        this.out.columns(data, {
            columnSplitter: '   ',
            showHeaders   : false
        })
    }
}

