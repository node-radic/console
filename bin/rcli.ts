#!/usr/bin/env node
import { Cli, Registry, interfaces as i, Command } from "../src";
import * as path from "path";
export * from '../example'

const cli = Cli.getInstance();
cli.config({ mode: 'groups' })

// global and root options
cli.options({
    v: { alias: 'verbose', desc: 'be more verbose', global: true, count: 3 },
    h: { alias: 'help', desc: 'shows help', global: true },
    V: { alias: 'version', desc: 'show version' },
    D: { alias: 'debug', desc: 'enable debugging', global: true }
})

cli.command('test', {
    desc   : 'Test using this command',
    options: {
        V: { alias: 'variate', desc: 'enables output formatter' }
    },
    handle(){
        console.log({ name: this.name });
    }
})


const parsed = cli.parse();

if ( parsed.opt('verbose') ) {

}

if ( parsed.opt('help') ) {

}

if ( parsed.opt('version') ) {
    cli.out.writeln('rcli version ' + require(path.join(__dirname, '..', 'package.json')).version)
}
cli.handle().execute()


//
//
// console.log('-----------------------------------------------------------------------------------------')
// cli.dump({parsed,route});
// console.log('-----------------------------------------------------------------------------------------')
// cli.dump({parsed2,parsed2route});
// console.log('-----------------------------------------------------------------------------------------')
// cli.dump({parsed4,parsed4route});
// console.log('-----------------------------------------------------------------------------------------')
