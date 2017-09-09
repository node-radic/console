import { Config, CommandConfig, OptionConfig, Modules } from "radical-console";
import { Log } from "@log";
import { OutputHelper } from "@output";
export declare class ModulesCmd {
    _config: CommandConfig;
    _options: OptionConfig[];
    showHelp: () => void;
    log: Log;
    config: Config;
    out: OutputHelper;
    modules: Modules;
    handle(): Promise<void>;
}
export default ModulesCmd;
