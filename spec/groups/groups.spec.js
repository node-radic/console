"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
describe("groups", function () {
    var groupsFixture = require('./fixture');
    var cli = groupsFixture.cli;
    cli.config({ autoExecute: false, mode: 'groups' });
    describe('command in group "yarn install" ', function () {
        var parsed, route;
        it('parse returns valid parsed node', function () {
            parsed = cli.parse('yarn install');
            expect(parsed).toBeDefined();
        });
        it('handle makes the route', function () {
            route = cli.handle();
            expect(route).toBeDefined();
        });
        it('the route is resolved correctly', function () { return expect(route.isResolved).toBeTruthy(); });
        it('the route executes the node', function () {
            route.execute();
            expect(route.isExecuted).toBeTruthy();
        });
    });
});
//# sourceMappingURL=groups.spec.js.map