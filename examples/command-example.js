"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../src");
var cli = src_1.Cli.getInstance();
cli.options({
    h: { alias: 'help', type: 'boolean', global: true }
});
cli.config({ mode: 'command' });
cli.option('t', { alias: 'target', type: 'string', desc: 'The target to write' });
cli.arguments({
    first: { required: true, type: 'string' },
    second: { default: 123 },
    third: { type: 'boolean' }
});
var parsed = cli.parse('lynx 123312 -t -h'.split(' '));
cli.dump(parsed);
//# sourceMappingURL=command-example.js.map