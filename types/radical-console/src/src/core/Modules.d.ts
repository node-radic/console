export declare class Modules {
    basePath: string;
    path(to?: string): string;
    exists(id: string): boolean;
    get<T>(id: string): T;
    keys(): string[];
}
