// import "reflect-metadata";
// import {ICli, app, BINDINGS} from "../";
//
// // get the cli instance
// let cli = app.get<ICli>(BINDINGS.CLI)
//
// // define global options
// cli.getGlobalDefinition().options({})
//
// // define
// cli
//     .getDefinition()
//     .arguments(`{name:The required name} {package=root:The package to name} {others?*:Other packages to name}`)
//     .options({
//         v: {alias: 'version', desc: 'Show the version of this app', boolean: true},
//         a: {alias: 'all', desc: 'Show all records, includes a, b and c as welll', boolean: true},
//         f: {alias: 'force', desc: 'Force execution even if not valid', boolean: true},
//         o: {alias: 'options', desc: 'Set extra options, uses dot-notation', default: {foo: 'nar', bar: 'foo'}, nested: true},
//     })
//     .help('h', 'help')
//
//
// // parse it!
// cli.parse(process.argv)
// let parsed = cli.parsed,
//     force = false;
//
// // only show version, then quit
// if (parsed.opt('v')) {
//     console.log('v2.4.1');
//     cli.exit();
// }
//
// // check if there's any argument or option passed. If not, there's no use to continue
// if (parsed.nargs === 0 && parsed.nopts === 0) {
//     cli.fail('No arguments or options. use -h or --help for a overview')
//     // or.. show help by default
//     cli.showHelp();
//     cli.exit();
// }
//
// // check for errors
// if(parsed.hasErrors()){
//     console.log('Errors found:')
//     parsed.errors.forEach((error:string) => {
//         console.log('- ' + error)
//     })
//     cli.fail('Resolve the errors and run again')
// }
//
// // enable ?force?
// if (parsed.opt('f')) {
//     force = true;
// }
//
// // this has a default, so the "if" statement can be removed. Keeping it does no harm
// if (parsed.opt('o')) {
//     console.log('Options:')
//     console.dir(parsed.opt('o'), {showHidden: true, colors: true, depth: 5});
// }
//
//
// cli.exit();
//
