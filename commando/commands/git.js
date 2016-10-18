"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var src_1 = require("../../src");
var GitGroup = (function (_super) {
    __extends(GitGroup, _super);
    function GitGroup() {
        _super.apply(this, arguments);
    }
    GitGroup = __decorate([
        src_1.group('git', 'Gi'), 
        __metadata('design:paramtypes', [])
    ], GitGroup);
    return GitGroup;
}(src_1.Group));
exports.GitGroup = GitGroup;
var GitInitCommand = (function (_super) {
    __extends(GitInitCommand, _super);
    function GitInitCommand() {
        _super.apply(this, arguments);
    }
    GitInitCommand = __decorate([
        src_1.command('init', 'Give the current working directory a bit of R.', GitGroup), 
        __metadata('design:paramtypes', [])
    ], GitInitCommand);
    return GitInitCommand;
}(src_1.Command));
exports.GitInitCommand = GitInitCommand;
//# sourceMappingURL=git.js.map