import { Config, CommandConfig, OptionConfig, Log } from "radical-console";
import { OutputHelper } from "@output";
export declare class RcliCmd {
    _config: CommandConfig;
    _options: OptionConfig[];
    showHelp: () => void;
    log: Log;
    config: Config;
    out: OutputHelper;
    always(): void;
    handle(): void;
}
export default RcliCmd;
