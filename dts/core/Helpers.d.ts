import { HelperOptions, HelperOptionsConfig } from "../interfaces";
import { Config } from "./config";
import { Dispatcher } from "./Dispatcher";
export declare class Helpers {
    protected _startedHelpers: Array<string>;
    protected _helpers: {
        [name: string]: HelperOptions;
    };
    events: Dispatcher;
    protected config: Config;
    protected started: boolean;
    addHelper<T>(options: HelperOptions): HelperOptions;
    enableHelper(name: string, customConfig?: HelperOptionsConfig): void;
    startHelpers(customConfigs?: {
        [name: string]: HelperOptionsConfig;
    }): void;
    protected startHelper(name: string, customConfig?: HelperOptionsConfig): void;
}
