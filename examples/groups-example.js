"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../src");
var cli = src_1.Cli.getInstance();
cli.options({
    h: { alias: 'help', type: 'boolean', global: true }
});
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
//# sourceMappingURL=groups-example.js.map