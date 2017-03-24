"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("./");
var cli = _1.Cli.getInstance();
cli.options({
    h: { alias: 'help', type: 'boolean', global: true }
});
function commandExample() {
    cli.config({ mode: 'command' });
    cli.option('t', { alias: 'target', type: 'string', desc: 'The target to write' });
    cli.arguments({
        first: { required: true, type: 'string' },
        second: { default: 123 },
        third: { type: 'boolean' }
    });
    var parsed = cli.parse('lynx 123312 -t -h'.split(' '));
    cli.dump(parsed);
}
function groupsExample() {
    cli.config({ mode: 'groups' });
    var cmdFirst = cli.command('first', {
        handle: function (opts) {
            return false;
        }
    });
    var grpGit = cli.group('git', {});
    var cmdGitFetch = cli.command('fetch', {
        group: grpGit,
        arguments: {
            first: { type: "string" }
        },
        handle: function (opts) {
            return false;
        }
    });
    var parsed = cli.parse('lynx 123312 -t -h'.split(' '));
}
commandExample();
//# sourceMappingURL=run.js.map