import { group } from "../../../../src";
import { Root } from "../root";
import { option } from "../../../../src/decorators";

@group('yarn', {
    group: Root
})
export class YarnGroup {
    // @option('test', 't')
    // test:string

}