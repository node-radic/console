#!/usr/bin/env node
import { command, option } from "../../../src";

@command('install')
export class RCliInstallCmd {

    @option('f', 'forces execution, even when its shouldnt')
    force: boolean;

    public handle() {

    }
}

