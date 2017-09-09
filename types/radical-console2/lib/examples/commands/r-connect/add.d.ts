import { CommandArguments, Config, InputHelper, Log, OutputHelper } from "radical-console";
export declare class RcliConnectAddCmd {
    out: OutputHelper;
    ask: InputHelper;
    log: Log;
    config: Config;
    pass: string;
    port: number;
    localPath: string;
    handle(args: CommandArguments, ...argv: any[]): void;
}
export default RcliConnectAddCmd;
