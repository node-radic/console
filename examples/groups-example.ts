import {interfaces as i, Cli} from '../src'


const cli = Cli.getInstance();

cli.options({
    h: { alias: 'help', type: 'boolean', global: true }
})


    cli.config({ mode: 'groups' });

    let cmdFirst = cli.command('first', <any> {
        handle(opts: i.CommandConfig): boolean{
            return false;
        }
    })

    let grpGit = cli.group('git', {})

    let cmdGitFetch = cli.command('fetch', <any> {
        group    : grpGit,
        arguments: {
            first: { type: "string" }
        },
        handle(opts: i.CommandConfig): boolean{
            return false;
        }
    })


    const parsed = cli.parse('lynx 123312 -t -h'.split(' '));

