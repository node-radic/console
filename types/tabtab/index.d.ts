export = tabtab

export module "tabtab"{
    export = tabtab
}

export function tabtab(options?:tabtab.Options):tabtab.Complete{
    return new tabtab.Complete()
}

export namespace tabtab {
    interface Env {
        args?:string[]
        complete?:boolean
        words?:string
        point?:string
        line?:string
        partial?:string
        last?:string
        lastPartial?:string
        prev?:string
    }
    interface Options {
        name?:string
        _?:string[]
        env?:Env
    }
    class Complete extends NodeJS.EventEmitter {
        constructor(options?:Options)
        start()
        handle(options?:Options)
        on(event: string | symbol, listener: Function): this;
        on(event: "program", callback: Callback): this;
        on(event: "list", callback: Callback): this;
    }

    interface Callback {
        (data:any, done: (err:Error|null, s:string[]) => void)
    }
}