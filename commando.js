"use strict";
require("reflect-metadata");
require('core-js');
require('shelljs/global');
const src_1 = require("./src");
require("./commando/index");
const log_1 = require("./src/core/log");
let cli = src_1.kernel.commandsCli();
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
let parsed = cli.parsed;
if (parsed.global.opt('v')) {
    cli.log.setLevel(log_1.LogLevel.info + parsed.global.opt('v'));
}
if (parsed.opt('T')) {
    let descriptor = src_1.kernel.get(src_1.BINDINGS.DESCRIPTOR);
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