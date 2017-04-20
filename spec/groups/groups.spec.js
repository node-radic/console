"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
describe("groups", function () {
    var groupsFixture = require('./fixture');
    var cli = groupsFixture.cli;
    cli.config({ autoExecute: false, mode: 'groups' });
    describe('command in group "yarn install" ', function () {
        var parsed, resolverResult;
        it('parse returns valid parsed node', function () {
            parsed = cli.parse('yarn install');
            expect(parsed).toBeDefined();
        });
        it('handle makes the route', function () {
            resolverResult = cli.handle();
            expect(resolverResult).toBeDefined();
        });
        it('the route is resolved correctly', function () { return expect(resolverResult.isResolved).toBeTruthy(); });
        it('the route executes the node', function () {
            resolverResult.execute();
            expect(resolverResult.isExecuted).toBeTruthy();
        });
    });
});
//# sourceMappingURL=groups.spec.js.map