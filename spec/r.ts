#!/usr/bin/env node
import 'reflect-metadata'
import { cli, CliConfig } from "../src";

cli.config(<CliConfig> {
    commands: {
        onMissingArgument: 'help'
    }
})


cli
    .helpers('input', 'output')
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


