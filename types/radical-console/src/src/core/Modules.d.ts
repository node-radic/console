export declare class Modules {
    basePath: string;
    protected _keys: string[];
    path(to?: string): string;
    exists(id: string): boolean;
    get<T>(id: string): T;
    keys(forceScan?: boolean): string[];
}
