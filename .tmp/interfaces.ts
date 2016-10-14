import {Command} from "./commands/command";
import {Group} from "./commands/group";

export interface ICli<T>
{
    argv: any[]
    parsed: IParsedDefinition<T>

    parse(argv?: any[])
    showHelp(...without: string[])

    getGlobalDefinition(): IOptionsDefinition
    getDefinition(): T

    on(event: string|symbol, listener: Function): this;
    once(event: string|symbol, listener: Function): this;
    emit(event: string|symbol, ...args: any[]): boolean;

    exit(fail?: boolean)
    fail(message: string)
}


export interface ICommandFactory
{
    createCommand(name: string): Command
    hasCommand(name: string): boolean
    setCommand(name: string, command: any, override?: boolean): void
    getCommands(): Command[]
    getCommand(name: string): any
    resolveCommandName(args: any[]): string

    resolveGroup(args: any[]): any
    hasGroup(ns): boolean
    getGroup(ns): any
    setGroup(ns, cls)
    createGroup(ns): Group
}

export interface IHelpWriter
{
    definition: IOptionsDefinition | IArgumentsDefinition | ICommandsDefinition
    usage(str: string)
    print(...without: string[])
    printUsage()
    printArguments()
    printOptions()
    printGlobalOptions()
}

export interface IInput
{
    ask(question: string): Promise<any>
}

export interface IOutput
{
// this.output.writeln();
    // this.output.write();
    // this.output.success()
    // this.output.title()
    // this.output.subtitle()
    // this.output.table()

    writeln(text: string)
    write(text: string)
    success(text: string)
    title(text: string)
    subtitle(text: string)
    table(options: any)
}

export interface ICommandHelper
{
    name: string
}


export interface IParserOptions extends YargsParserOptions
{
    nested: string[]
}

export interface IArgumentDefinition
{
    name?: string
    required?: boolean
    default?: any
    type?: string
    description?: string
    value?: any
}

export interface IArgumentDefinitions
{
    [name: string]: IArgumentDefinition
}

export interface IOptionsDefinition
{
    reset()
    array(v: string|string[]): this
    boolean(v: string|string[]): this
    count(v: string|string[]): this
    number(v: string|string[]): this
    string(v: string|string[]): this
    alias(x: any, y?: string): this
    default(k: string, val: any): this
    option(k: string, o: any): this
    options(options: any): this
    getOptions(): IParserOptions
    mergeOptions(definition: this): this

    helpKey?: string;
    help(key: string, alias: string, fn?: Function): this
    help(key: string, fn?: Function): this
    isHelpEnabled(): boolean
    showHelp(...without: string[]): void
}

export interface IArgumentsDefinition extends IOptionsDefinition
{
    argument(name: string, desc?: string, required?: boolean, type?: string, def?: any): this
    arguments(args: any): this
    getArguments(): IArgumentDefinitions
    mergeArguments(definition: this): this
    hasArguments(): boolean
}

export interface ICommandsDefinition extends IOptionsDefinition
{
    command(name: string, cls: any): this
    commandGroup(name: string, cls: any): this
    getCommands(): {[name: string]: string}
    getCommandGroups(): {[name: string]: string}
}


export interface IDefinitionSignatureParser
{
    parse<T>(signature: string): T
}

export interface IDefinitionParser<T>
{
    definition: T
    argv: any[]

    parse(): IParsedDefinition<T>
}

export interface IParsedDefinition<T>
{
    argv: any[]
    definition: T
    args: YargsParserDetailed

    options: {[name: string]: any}
    arguments: {[name: string]: any}
    errors: string[]

    nargs: number
    nopts: number

    hasArg(n: string): boolean
    arg(n: string): any
    hasOpt(n: string): boolean
    opt(n: string): any

    hasErrors(): boolean
}
