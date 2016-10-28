"use strict";
(function () { }());
require("reflect-metadata");
var src_1 = require("./src");
require("./commando/index");
var cli = src_1.kernel.commandsCli();
cli.config
    .title('Commando')
    .description('General all-round super duper cli')
    .version('1.0.1');
cli.globalDefinition
    .help('h', 'help')
    .options({
    v: { alias: 'verbose', desc: 'Increase output verbosity', count: true },
    D: { alias: 'dump-parsed', desc: 'Dump parsed definition to console', boolean: true }
});
cli.definition
    .options({
    V: { alias: 'version', desc: 'Show version', boolean: true },
    t: { alias: 'tree', desc: 'Display command tree', boolean: true }
});
cli.parse(process.argv);
var parsed = cli.parsed;
if (parsed.global.opt('v')) {
    cli.log.setLevel(2 + parsed.global.opt('v'));
    var m = {
        version: { desc: 'Show version', boolean: true },
        t: { alias: 'tree', desc: 'Display command tree', boolean: true }
    };
    cli.log.error('error');
    cli.log.warn('warn');
    cli.log.info('info');
    cli.log.verbose('verse');
    cli.log.debug('verse');
    cli.log.silly('silly');
}
if (parsed.opt('t')) {
    var descriptor = src_1.kernel.get(src_1.BINDINGS.DESCRIPTOR);
    descriptor.commandTree('Command Tree');
    cli.exit();
}
if (parsed.opt('V')) {
    cli.out.line(cli.config('app.version'));
    cli.exit();
}
if (parsed.global.opt('D')) {
    cli.out.dump(cli.parsed);
}
cli.handle();
//# sourceMappingURL=commando.js.map