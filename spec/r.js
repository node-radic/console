#!/usr/bin/env node
"use strict";
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
