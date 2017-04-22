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
var src_1 = require("../../../src");
var Root = (function () {
    function Root(cli, out) {
        this.cli = cli;
        this.out = out;
    }
    Root.prototype.handle = function () {
        this.out.success('This is the @root group.');
        if (this.version) {
            this.out.line('1.4.6');
        }
    };
    return Root;
}());
__decorate([
    src_1.option('Show version', 'V'),
    __metadata("design:type", Boolean)
], Root.prototype, "version", void 0);
Root = __decorate([
    src_1.root(),
    src_1.group(),
    __param(0, src_1.inject('console.cli')),
    __param(1, src_1.inject('console.helpers.output')),
    __metadata("design:paramtypes", [src_1.Cli,
        src_1.Output])
], Root);
exports.Root = Root;
//# sourceMappingURL=root.js.map