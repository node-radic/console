import {Cli, ParsedNode } from "../../src";

describe("groups", () => {
    let groupsFixture = require('./fixture');
    let cli:Cli           = groupsFixture.cli;
    cli.config({ autoExecute: false, mode: 'groups' })
    describe('command in group "yarn install" ', () => {
        let parsedRootNode: ParsedNode<any>, parsedNode: ParsedNode<any>;
        it('parse returns valid parsed root node', () => {
            parsedRootNode = cli.parse('yarn install');
            expect(parsedRootNode).toBeDefined()
        })
        it('resolve returns a resolved and parsed node', () => {
            parsedNode = <any> cli.resolve();
            expect(parsedNode).toBeDefined()
        })
        it('handle executes the resolved parsed node', () => {
            expect(cli.handle(parsedNode)).toBeTruthy()

        })

    });
});
