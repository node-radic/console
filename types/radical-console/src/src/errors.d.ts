export interface ErrorBase extends Error {
    readonly name: string;
    readonly message: string;
    readonly stack: string;
}
export interface ErrorBaseConstructor {
    new (message: string): ErrorBase;
    readonly prototype: ErrorBase;
}
export declare const ErrorBase: ErrorBaseConstructor;
export declare class ModuleNotFoundError extends ErrorBase {
    readonly code: string;
    constructor(message: string);
}
