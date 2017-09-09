import { CliConfig, CommandArgumentConfig, CommandConfig, HelperOptions, HelperOptionsConfig, OptionConfig } from "./interfaces";
import { ConstructorOptions as EventsConstructorOptions } from "eventemitter2";
export declare const defaults: {
    config(): CliConfig;
    command<T extends CommandConfig = CommandConfig>(cls: Function): T;
    option(cls: Object, key: string): OptionConfig;
    events(): EventsConstructorOptions;
    argument(index: number): CommandArgumentConfig;
    helper<T extends HelperOptionsConfig>(): HelperOptions<T>;
};
