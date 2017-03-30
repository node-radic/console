"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../../src");
var git_1 = require("./git");
var S = require("string");
var src_2 = require("../../src");
var cli_1 = require("../../src/core/cli");
var GitFetchCommand = (function () {
    function GitFetchCommand(cli) {
        this.cli = cli;
    }
    GitFetchCommand.prototype.handle = function () {
        console.log('a', this);
        console.log({ 'u': S('upload-pack').camelize().toString() });
    };
    return GitFetchCommand;
}());
GitFetchCommand = __decorate([
    src_1.command('fetch', {
        group: git_1.GitGroup,
        options: {
            a: { alias: 'append', desc: 'append to .git/FETCH_HEAD instead of overwriting' },
            'upload-pack': { type: 'string', desc: 'path to upload pack on remote end' }
        },
        arguments: {
            remote: { required: true, type: 'string', desc: 'The target remote' },
            branch: { type: 'string', desc: 'The branch ' }
        }
    }),
    __param(0, src_2.inject('console.cli')),
    __metadata("design:paramtypes", [cli_1.Cli])
], GitFetchCommand);
exports.GitFetchCommand = GitFetchCommand;
//# sourceMappingURL=git_fetch.js.map