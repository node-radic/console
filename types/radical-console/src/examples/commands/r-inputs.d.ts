import { InputHelper } from "../../src/helpers/helper.input";
import { OutputHelper } from "../../src/helpers/helper.output";
export default class InputsCmd {
    ask: InputHelper;
    out: OutputHelper;
    handle(): Promise<void>;
}
