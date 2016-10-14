/*
 opt def
 arg def
 com def

interface IParsedArgv extends YargsParserDetailed
{
    argv?: IArgvParsed
}

interface IArgvParserOptions extends YargsParserOptions
{
    nested: string[]
    desc: {[key: string]: string}
}


interface IDefinition
{}


interface IArgument
{
    name?: string
    required?: boolean
    default?: any
    type?: string
    description?: string
    value?: any
}
class OptionsDefinition implements IDefinition
{
}
class ArgumentsDefinition extends OptionsDefinition
{

    argument(name: string, desc?: string, required?: boolean, type?: string, def?: any): this {return }

    arguments(args: any): this {return }

    getArguments(): IArgument[] {return }

    mergeArguments(definition: this): this {return }

    hasArguments(): boolean {return }
}
class CommandsDefinition extends ArgumentsDefinition
{
}

 */
