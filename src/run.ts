import { Cli, interfaces as i } from './'

const cli = Cli.getInstance();

cli.options({
    h: { alias: 'help', type: 'boolean', global: true }
})

function commandExample() {
    cli.config({ mode: 'command' });

    cli.option('t', {alias: 'target', type: 'string', desc: 'The target to write'});

    cli.arguments({
        first : { required: true, type: 'string' },
        second: { default: 123 },
        third : { type: 'boolean' }
    });


    const parsed = cli.parse('lynx 123312 -t -h'.split(' '));

    cli.dump(parsed);
}

function groupsExample() {
    cli.config({ mode: 'groups' });

    let cmdFirst = cli.command('first', {
        handle(opts: i.CommandConfig): boolean{
            return false;
        }
    })

    let grpGit = cli.group('git', {})

    let cmdGitFetch = cli.command('fetch', {
        group    : grpGit,
        arguments: {
            first: { type: "string" }
        },
        handle(opts: i.CommandConfig): boolean{
            return false;
        }
    })


    const parsed = cli.parse('lynx 123312 -t -h'.split(' '));

}

commandExample();
// .arguments({
//     first : { type: 'string', required: true },
//     second: { default: 123 },
//     third : { type: 'boolean' },
// })
