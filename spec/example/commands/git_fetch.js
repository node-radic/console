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
var Output_1 = require("../../src/helpers/Output");
var Describer_1 = require("../../src/helpers/Describer");
var GitFetchCommand = (function () {
    function GitFetchCommand(cli, out, describer) {
        this.cli = cli;
        this.out = out;
        this.describer = describer;
    }
    GitFetchCommand.prototype.handle = function () {
        this.out.writeln('{orange}Overview{/orange}');
        if (this.help) {
            var help = [this.describer.options(this._config.options)].join('\n');
            this.out.writeln(help);
            process.exit();
        }
        console.log({ 'u': S('upload-pack').camelize().toString() });
        this.out.success('Works good !!').nl.line('Continue like this..');
    };
    GitFetchCommand.prototype.writeColumns = function (data) {
        this.out.columns(data, {
            columnSplitter: '   ',
            showHeaders: false
        });
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
    __param(1, src_2.inject('console.helpers.output')),
    __param(2, src_2.inject('console.helpers.describer')),
    __metadata("design:paramtypes", [typeof (_a = typeof cli_1.Cli !== "undefined" && cli_1.Cli) === "function" && _a || Object, typeof (_b = typeof Output_1.default !== "undefined" && Output_1.default) === "function" && _b || Object, typeof (_c = typeof Describer_1.default !== "undefined" && Describer_1.default) === "function" && _c || Object])
], GitFetchCommand);
exports.GitFetchCommand = GitFetchCommand;
var _a, _b, _c;
//# sourceMappingURL=git_fetch.js.map