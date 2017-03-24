import { Cli, Registry, interfaces as i } from "../src";
import { Command } from "../src/cli-children";
export * from './decorator'

const cli = Cli.getInstance();
cli.config({ mode: 'groups' })

// global and root options
cli.options({
    v: { alias: 'verbose', desc: 'be more verbose', global: true, count: 3 },
    h: { alias: 'help', desc: 'shows help', global: true },
    V: { alias: 'version', desc: 'show version' }
})

cli.command('test', {
    desc   : 'Test using this command',
    options: {
        V: { alias: 'variate', desc: 'enables output formatter' }
    },
    handle(){
        console.log({name: this.name});

    }
})


const parsed = cli.parse('test -a -vv -h'.split(' '));
const route  = cli.handle();
route.execute();
//
// const parsed2      = cli.parse('git do -D -vv --tree -h'.split(' '));
// const parsed2route = cli.handle();
// parsed2route.execute();
// const parsed3 = cli.parse('git fetch 123312 -a -vv -h'.split(' '));
// const parsed3route   = cli.handle();
// //
// const parsed4      = cli.parse('test -V'.split(' '));
// const parsed4route = cli.handle();
// parsed4route.execute();

//
// const parsed5 = cli.parse('git do'.split(' '));
// const parsed5route   = cli.handle();
//
// const parsed6 = cli.parse('git 123312 -a -vv -h'.split(' '));
// const parsed6route   = cli.handle();
//
// const parsed7 = cli.parse('-V'.split(' '));
// const parsed7route   = cli.handle();
//
// const parsed8 = cli.parse('git -V'.split(' '));
// const parsed8route   = cli.handle();


if ( parsed.opt('verbose') ) {

}

if ( parsed.opt('help') ) {

}

if ( parsed.opt('version') ) {

}
//
//
// console.log('-----------------------------------------------------------------------------------------')
// cli.dump({parsed,route});
// console.log('-----------------------------------------------------------------------------------------')
// cli.dump({parsed2,parsed2route});
// console.log('-----------------------------------------------------------------------------------------')
// cli.dump({parsed4,parsed4route});
// console.log('-----------------------------------------------------------------------------------------')
