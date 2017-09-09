import { InputHelper } from "radical-console";
import { OutputHelper } from "@output";
export default class InputsCmd {
    ask: InputHelper;
    out: OutputHelper;
    handle(): Promise<void>;
}
