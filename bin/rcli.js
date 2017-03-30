#!/usr/bin/env node
"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../src");
var path = require("path");
__export(require("../example"));
var cli = src_1.Cli.getInstance();
cli.config({ mode: 'groups' });
cli.options({
    v: { alias: 'verbose', desc: 'be more verbose', global: true, count: 3 },
    h: { alias: 'help', desc: 'shows help', global: true },
    V: { alias: 'version', desc: 'show version' },
    D: { alias: 'debug', desc: 'enable debugging', global: true }
});
cli.command('test', {
    desc: 'Test using this command',
    options: {
        V: { alias: 'variate', desc: 'enables output formatter' }
    },
    handle: function () {
        console.log({ name: this.name });
    }
});
var parsed = cli.parse();
if (parsed.opt('verbose')) {
}
if (parsed.opt('help')) {
}
if (parsed.opt('version')) {
    cli.out.writeln('rcli version ' + require(path.join(__dirname, '..', 'package.json')).version);
}
cli.handle().execute();
//# sourceMappingURL=rcli.js.map