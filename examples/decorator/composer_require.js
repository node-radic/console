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
var src_1 = require("../../src");
var composer_1 = require("./composer");
var ComposerRequireCommand = (function (_super) {
    __extends(ComposerRequireCommand, _super);
    function ComposerRequireCommand() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ComposerRequireCommand;
}(src_1.Command));
ComposerRequireCommand = __decorate([
    src_1.command('require', {
        group: composer_1.ComposerGroup,
        arguments: {
            name: { desc: 'Project name', type: 'string', required: true }
        }
    })
], ComposerRequireCommand);
exports.ComposerRequireCommand = ComposerRequireCommand;
//# sourceMappingURL=composer_require.js.map