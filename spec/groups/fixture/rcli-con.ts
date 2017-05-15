#!/usr/bin/env node
import { command } from "../../../src";

@command('con', 'Manage connections', [ 'list', 'set', 'get' ])
export class RCliConCmd {

    public handle() {

    }
}

