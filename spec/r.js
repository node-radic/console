#!/usr/bin/env node
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
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var src_1 = require("../src");
src_1.cli.config({
    commands: {
        onMissingArgument: 'help'
    }
});
src_1.cli
    .helper('input')
    .helper('output')
    .helper('help', {
    addShowHelpFunction: true,
    showOnError: true,
    app: {
        title: 'Radic CLI'
    },
    option: { enabled: true }
})
    .helper('verbose', {
    option: { key: 'v', name: 'verbose' }
})
    .start(__dirname + '/commands/r');
var Help = (function (_super) {
    __extends(Help, _super);
    function Help() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Help.prototype.printOptions = function (options) {
        var _this = this;
        options.forEach(function (option) {
            _this.out.line(' - ' + option.name);
        });
    };
    return Help;
}(src_1.CommandDescriptionHelper));
