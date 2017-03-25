import { interfaces, group, Group } from "../../../../src";
import { GitGroup } from "../index";
export * from './pull'

@group('do', {
    group: GitGroup
})
export class GitDoGroup extends Group {

    handle() {

        return undefined;
    }
}

