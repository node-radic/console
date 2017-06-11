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
        app: {
            title: 'Radic CLI'
        },
        option: { key: 'h', name: 'help' }
    })
    .helper('verbose', {
        option: { key: 'v', name: 'verbose' }
    })
    .start(__dirname + '/commands/r');


