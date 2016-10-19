import { injectable } from "./kernel";


export interface IHelper {
    name: string
}

export interface IHelpers<T extends IHelper> {
    helpers: {[name: string]: T}
    get<H extends T>(name: string): T
    set<H extends T>(name: string, helper: T): this
    has(name): boolean
}


@injectable()
export class Helpers<T extends IHelper> implements IHelpers<T> {
    helpers: {[name: string]: T}

    get<H extends T>(name: string): T {
        return this.helpers[ name ];
    }

    set<H extends T>(name: string, helper: T): this {
        this.helpers[ name ] = helper
        return this
    }

    has(name): boolean {
        return this.helpers[ name ] !== undefined
    }
}
