#!/usr/bin/env node
import 'reflect-metadata'

import {Config} from '@radic/util'
import { container,CommandDescriptionHelper as BaseHelper,OptionConfig, cli, CliConfig , Config as IConfig} from "../src";

cli.config(<CliConfig> {
    commands: {
        onMissingArgument: 'help'
    }
})


cli
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



class Help extends BaseHelper {

    protected printOptions(options: OptionConfig[]){
        options.forEach((option) => {
            this.out.line(' - ' + option.name)
        })
    }
}