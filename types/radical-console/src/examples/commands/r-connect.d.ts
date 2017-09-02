import { CommandArguments, CommandConfig, Config, Log, OptionConfig, OutputHelper } from "../../src";
export declare class RcliConnectCmd {
    showHelp: () => void;
    _config: CommandConfig;
    _options: OptionConfig[];
    out: OutputHelper;
    log: Log;
    config: Config;
    handle(args: CommandArguments, argv: any[]): void;
}
export default RcliConnectCmd;
