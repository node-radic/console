
import {ParsedNode,ResolverResult } from "../../src";

describe("groups", () => {
    let groupsFixture = require('./fixture');
    let cli           = groupsFixture.cli;
    cli.config({ autoExecute: false, mode: 'groups' })
    describe('command in group "yarn install" ', () => {
        let parsed: ParsedNode, resolverResult: ResolverResult<any, any>;
        it('parse returns valid parsed node', () => {
            parsed = cli.parse('yarn install');
            expect(parsed).toBeDefined()
        })
        it('handle makes the route', () => {
            resolverResult = cli.handle();
            expect(resolverResult).toBeDefined()
        })
        it('the route is resolved correctly', () => expect(resolverResult.isResolved).toBeTruthy())
        it('the route executes the node', () => {
            resolverResult.execute();
            expect(resolverResult.isExecuted).toBeTruthy()
        })

    });
});
