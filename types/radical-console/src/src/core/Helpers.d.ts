import { HelperOptions, HelperOptionsConfig } from "../interfaces";
import { Config } from "./config";
import { Log } from "./Log";
import { Dispatcher } from "./Dispatcher";
export declare class Helpers {
    protected _startedHelpers: Array<string>;
    protected _helpers: {
        [name: string]: HelperOptions;
    };
    events: Dispatcher;
    log: Log;
    protected config: Config;
    protected started: boolean;
    has(name: string): boolean;
    isEnabled(name: string): boolean;
    add<T>(options: HelperOptions): HelperOptions;
    enable(name: string, customConfig?: HelperOptionsConfig): void;
    startHelpers(): void;
    /** some helpers can/need to be enabled before usage **/
    protected startHelper(name: string, customConfig?: HelperOptionsConfig): void;
}
