"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
describe("groups", function () {
    var groupsFixture = require('./fixture');
    var cli = groupsFixture.cli;
    cli.config({ autoExecute: false, mode: 'groups' });
    describe('command in group "yarn install" ', function () {
        var parsedRootNode, parsedNode;
        it('parse returns valid parsed root node', function () {
            parsedRootNode = cli.parse('yarn install');
            expect(parsedRootNode).toBeDefined();
        });
        it('resolve returns a resolved and parsed node', function () {
            parsedNode = cli.resolve();
            expect(parsedNode).toBeDefined();
        });
        it('handle executes the resolved parsed node', function () {
            expect(cli.handle(parsedNode)).toBeTruthy();
        });
    });
});
