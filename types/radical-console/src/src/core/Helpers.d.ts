import { Config } from "./config";
import { Log } from "./Log";
import { Dispatcher } from "./Dispatcher";
import { Modules } from "./Modules";
import { HelperOptions, HelperOptionsConfig } from "../interfaces";
export declare class Helpers {
    protected _startedHelpers: Array<string>;
    protected _helpers: {
        [name: string]: HelperOptions;
    };
    events: Dispatcher;
    log: Log;
    protected config: Config;
    protected modules: Modules;
    protected started: boolean;
    has(name: string): boolean;
    isEnabled(name: string): boolean;
    add<T>(options: HelperOptions): HelperOptions;
    enable(name: string, customConfig?: HelperOptionsConfig): void;
    /**
     * loops trough all enabled helpers and starts them
     */
    startHelpers(): void;
    /**
     * some helpers can/need to be enabled before usage
     */
    protected startHelper(name: string, customConfig?: HelperOptionsConfig): void;
}
