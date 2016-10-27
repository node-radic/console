import { Group, group, command, Command } from "../../src";
import { paths } from "../core/paths";
import { unlinkSync } from "fs";
import { copySync } from "fs-extra";
import * as moment from 'moment';

@command('init', 'Initialize R', 'Give the current working directory a bit of R.')
export class InitCommand extends Command {
    handle() {
        this.out.success('Success')
    }
}

@command('test', 'Test R', 'Test a bit of R.')
export class TestCommand extends Command {
    handle() {
        this.out.success('Success')
    }
}
