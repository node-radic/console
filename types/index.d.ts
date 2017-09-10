declare module 'multispinner' {
    import { EventEmitter } from 'events';
    import { Figures } from '../src/modules/output/interfaces';

    export type MultispinnerSpinners = string[] | { [key: string]: string }

    export interface MultispinnerOptions {
        autoStart?: boolean
        clear?: boolean
        frames?: string[]
        preText?: string
        postText?: string
        color?: {
            incomplete: string
            success: string
            error: string
        }
        symbol?: {
            incomplete: keyof Figures
            success: keyof Figures
            error: keyof Figures
        }
        indent?: number
        interval?: number

    }

    export class Multispinner extends EventEmitter {
        constructor(spinners: MultispinnerSpinners, opts?: MultispinnerOptions)

        start()

        success(spinner: string)

        error(spinner: string)

        on: (event: 'done', cb?: Function) => void
        on: (event: 'success', cb?: Function) => void
        on: (event: 'err', cb?: (spinner?: string) => void) => void
    }
}