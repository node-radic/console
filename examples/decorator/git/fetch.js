"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var git_1 = require("../git");
var src_1 = require("../../../src");
var GitFetchCommand = (function (_super) {
    __extends(GitFetchCommand, _super);
    function GitFetchCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return GitFetchCommand;
}(src_1.Command));
GitFetchCommand = __decorate([
    src_1.command('fetch', {
        group: git_1.GitGroup,
        options: {
            a: { alias: 'append', desc: 'append to .git/FETCH_HEAD instead of overwriting' },
            'upload-pack': { type: 'string', desc: 'path to upload pack on remote end' }
        }
    })
], GitFetchCommand);
exports.GitFetchCommand = GitFetchCommand;
//# sourceMappingURL=fetch.js.map