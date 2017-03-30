"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../src");
__export(require("./decorator"));
var cli = src_1.Cli.getInstance();
cli.config({ mode: 'groups' });
cli.options({
    v: { alias: 'verbose', desc: 'be more verbose', global: true, count: 3 },
    h: { alias: 'help', desc: 'shows help', global: true },
    V: { alias: 'version', desc: 'show version' }
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
var parsed = cli.parse('git fetch origin master -a -vv -h -V');
if (parsed.opt('verbose')) {
}
if (parsed.opt('help')) {
}
if (parsed.opt('version')) {
}
cli.handle().execute();
//# sourceMappingURL=decorator-example.js.map