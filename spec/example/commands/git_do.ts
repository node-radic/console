import { group, Group } from "../../src";
import { GitGroup } from "./git";

@group('do', {
    group: GitGroup
})
export class GitDoGroup extends Group {

    handle() {

        return undefined;
    }
}


export * from './git_do_pull'
