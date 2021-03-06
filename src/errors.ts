export interface ErrorBase extends Error {
    readonly name: string;
    readonly message: string;
    readonly stack: string;
};

export interface ErrorBaseConstructor {
    new (message: string): ErrorBase;

    readonly prototype: ErrorBase;
}

export const ErrorBase: ErrorBaseConstructor = <any>class ErrorBase {
    public constructor(message: string) {
        Object.defineProperty(this, 'name', {
            get: () => (this.constructor as any).name,
        });
        Object.defineProperty(this, 'message', {
            get: () => message,
        });
        Error.captureStackTrace(this, this.constructor);
    }
};
(ErrorBase as any).prototype                 = Object.create(Error.prototype);
ErrorBase.prototype.constructor              = ErrorBase;

export class ModuleNotFoundError extends ErrorBase {
    readonly code: string = 'MODULE_NOT_FOUND'

    constructor(message: string) {
        super(message);
    }
}

export class HelperDependencyMissingError extends ErrorBase {
    readonly code: string = 'HELPER_DEPENDENCY_MISSING'
    constructor(helperName:string, dependencyName:string){
        super(`Cannot start helper [${helperName}]. It depends on [${dependencyName}]. Either enable it or set config [helpers.${helperName}.enableDepends] to [true]`)
    }
}