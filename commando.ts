import 'reflect-metadata'

import {kernel, CommandsCli, BINDINGS , IDescriptor} from './src';
import './commando/index'
let cli = kernel.commandsCli();

cli.globalDefinition
    .help('h', 'help')
    .options({
        v: { alias: 'verbose', desc: 'Increase output verbosity', count: true}
    })

cli.definition.options({
    version: {  desc: 'Show version', boolean: true },
    t: { alias: 'tree', desc: 'Display command tree', boolean: true }
})


cli.config
    .title('Commando')
    .description('General all-round super duper cli')
    .version('1.0.1');

// parse
cli.parse(process.argv)
let parsed = cli.parsed;

// handle
if ( parsed.opt('d') ) {
    cli.log.setLevel('debug')
}

if(parsed.opt('t')){
    let descriptor = kernel.get<IDescriptor>(BINDINGS.DESCRIPTOR)
    descriptor.commandTree('Command Tree')
    cli.exit()
}

if ( parsed.opt('V') ) {
    cli.out.line(cli.config('app.version'));
    cli.exit();
}

if(parsed.hasOpt('v')){
    console.log('verbosity level: ', parsed.global.opt('v'))
}

// let the other stuff be handled automaticly
cli.handle();


