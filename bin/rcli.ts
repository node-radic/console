#!/usr/bin/env node
import cli from '../spec/groups/fixture/index'

// cli.config.set('autoExecute', false);
// const parsed = cli.parse();
// cli.handle().execute()


let parsedRootNode = cli.parse()

cli.handle()