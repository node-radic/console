import { interfaces as i, Cli } from '../src'


const cli = Cli.getInstance();

cli.options({
    h: { alias: 'help', type: 'boolean', global: true }
})


cli.config({ mode: 'command' });

cli.option('t', { alias: 'target', type: 'string', desc: 'The target to write' });

cli.arguments({
    first : { required: true, type: 'string' },
    second: { default: 123 },
    third : { type: 'boolean' }
});


const parsed = cli.parse('lynx 123312 -t -h'.split(' '));

cli.dump(parsed);
