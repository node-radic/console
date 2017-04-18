
import {ParsedNode,Route } from "../../src";

describe("groups", () => {
    let groupsFixture = require('./fixture');
    let cli           = groupsFixture.cli;
    cli.config({ autoExecute: false, mode: 'groups' })
    describe('command in group "yarn install" ', () => {
        let parsed: ParsedNode, route: Route<any, any>;
        it('parse returns valid parsed node', () => {
            parsed = cli.parse('yarn install');
            expect(parsed).toBeDefined()
        })
        it('handle makes the route', () => {
            route = cli.handle();
            expect(route).toBeDefined()
        })
        it('the route is resolved correctly', () => expect(route.isResolved).toBeTruthy())
        it('the route executes the node', () => {
            route.execute();
            expect(route.isExecuted).toBeTruthy()
        })

    });
});
