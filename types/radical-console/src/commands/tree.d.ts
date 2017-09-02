import { Config } from "../core/config";
import { OutputHelper } from "../helpers/helper.output";
import { SubCommandsGetFunction } from "../utils";
import { Cli } from "../core/Cli";
import { CommandConfig } from "../interfaces";
export declare class TreeCmd {
    out: OutputHelper;
    cli: Cli;
    config: Config;
    desc: boolean;
    opts: boolean;
    all: boolean;
    colors: {
        group: string;
        command: string;
        description: string;
        argument: string;
        requiredArgument: string;
        option: string;
    };
    readonly getSubCommands: SubCommandsGetFunction;
    protected printTree(label: string, config: CommandConfig): void;
    protected getChildren(config: CommandConfig): any;
    protected getChild(config: CommandConfig): string;
}
