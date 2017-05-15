#!/usr/bin/env node
import { command } from "../../../src";

@command('list', 'List connections')
export class RCliListCmd {

    all: boolean


    public handle() {

    }
}

