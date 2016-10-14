"use strict";
require("reflect-metadata");
var src_1 = require("../src");
require("./commands");
var bindings_1 = require("../src/core/bindings");
var cli = src_1.app.commandsCli();
cli.globalDefinition
    .options({
    v: { alias: 'version', desc: 'Show the version of this app', boolean: true },
    d: { alias: 'debug', desc: 'Show debugging output', boolean: true }
})
    .help('h', 'help');
cli.definition
    .options({
    t: { alias: 'tree', desc: 'Display command tree', boolean: true }
});
cli.config
    .title('Radic Console Preview')
    .description('A preview of a command based CLI')
    .version('1.0.1');
cli.parse(process.argv);
var parsed = cli.parsed;
if (parsed.opt('d')) {
    cli.log.setLevel('debug');
}
if (parsed.opt('t')) {
    var descriptor = src_1.app.get(bindings_1.BINDINGS.DESCRIPTOR);
    descriptor.commandTree('Command Tree');
    cli.exit();
}
if (parsed.opt('v')) {
    cli.out.line(cli.config('app.version'));
    cli.exit();
}
if (parsed.isCommand) {
    parsed.command.fire().then(function () {
        cli.exit();
    });
}
else if (parsed.isGroup) {
    parsed.group.fire().then(function () {
        cli.exit();
    });
    parsed.group.showHelp();
}
else if (parsed.isRoot) {
    cli.showHelp();
}
else {
    cli.fail('No options or arguments provided.  Use the -h or --help option to show what can be done');
}
//# sourceMappingURL=mode.commands.js.map