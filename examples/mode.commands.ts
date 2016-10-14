import "reflect-metadata";
import { app } from "../src";
import "./commands";
import { BINDINGS } from "../src/core/bindings";
import { IDescriptor } from "../src/io/descriptor";


let cli = app.commandsCli();

// define
cli.globalDefinition
    .options({
        v: { alias: 'version', desc: 'Show the version of this app', boolean: true },
        d: { alias: 'debug', desc: 'Show debugging output', boolean: true }
    })


cli.definition
    .options({
        t: { alias: 'tree', desc: 'Display command tree', boolean: true }
    })

cli.config
    .title('Radic Console Preview')
    .description('A preview of a command based CLI')
    .version('1.0.1')
    .help('h', 'help');

// parse
cli.parse(process.argv)
let parsed = cli.parsed;

// handle
if ( parsed.opt('d') ) {
    cli.log.setLevel('debug')
}

if(parsed.opt('t')){
    let descriptor = app.get<IDescriptor>(BINDINGS.DESCRIPTOR)
    descriptor.commandTree('Command Tree')
    cli.exit()
}

if ( parsed.opt('v') ) {
    cli.out.line(cli.config('app.version'));
    cli.exit();
}

// let the other stuff be handled automaticly
cli.handle();

// if ( parsed.isCommand ) {
//     parsed.command.fire().then(() => {
//         cli.exit();
//     });
// } else if ( parsed.isGroup ) {
//     parsed.group.fire().then(() => {
//         cli.exit();
//     });
//     parsed.group.showHelp();
// } else if ( parsed.isRoot ) {
//     cli.showHelp()
// } else {
//     cli.fail('No options or arguments provided.  Use the -h or --help option to show what can be done')
// }



