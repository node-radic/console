(function(){}())
import "reflect-metadata";
import { kernel, BINDINGS, IDescriptor } from "./src";
import "./commando/index";
import { LogCliHelper } from "./src/helpers/LogCliHelper";


let cli = kernel.commandsCli();

cli.config
    .title('Commando')
    .description('General all-round super duper cli')
    .version('1.0.1');

cli.globalDefinition
    .help('h', 'help')
    .options({
        v: { alias: 'verbose', desc: 'Increase output verbosity', count: true }
    })


cli.definition
    .options({
        version: { desc: 'Show version', boolean: true },
        t      : { alias: 'tree', desc: 'Display command tree', boolean: true }
    })


// parse


cli.parse(process.argv)
let parsed = cli.parsed;


if ( parsed.global.opt('v') ) {
    // cli.out.line('v:' + parsed.global.opt('v'))
    cli.log.setLevel(parsed.global.opt('v'))
    let m ={
        version: { desc: 'Show version', boolean: true },
        t      : { alias: 'tree', desc: 'Display command tree', boolean: true }
    }
    cli.log.error('error', m)
    cli.log.warn('warn', m)
    cli.log.info('info')
    cli.log.verbose('verse')
    cli.log.debug('verse')
    cli.log.silly('silly')
}

// handle
if ( parsed.opt('d') ) {
    cli.log.setLevel('debug')
    cli.log.getWinston()
}

if ( parsed.opt('t') ) {
    let descriptor = kernel.get<IDescriptor>(BINDINGS.DESCRIPTOR)
    descriptor.commandTree('Command Tree')
    cli.exit()
}

if ( parsed.opt('V') ) {
    cli.out.line(cli.config('app.version'));
    cli.exit();
}


// let the other stuff be handled automaticly
cli.handle();



