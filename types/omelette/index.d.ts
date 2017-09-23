export = omelette
export module "omelette"{
    export = omelette
}

export function omelette(fragments?:string|string[]):omelette.Omelette{
    return new omelette.Omelette()
}

export namespace omelette {
    class Omelette extends NodeJS.EventEmitter {
        compgen:number
        install:boolean
        intallFish:boolean
        isDebug:boolean
        fragment:number
        line:string
        word:string
        init():never
        setupShellInitFile(initFile:string)
        getDefaultShellInitFile():string
        generateTestAliases()
        getActiveShell():'bash'|'zsh'|'fish'
        checkInstall():never
        generateCompletionCodeFish():string
        generateCompletionCode():string
        tree(objectTree:null|object):this
        generate():never
        reply(words?:null|string[]):never
        setFragments(...f:string[]):never
        setProgram(programs:string|string[]):never
    }

}