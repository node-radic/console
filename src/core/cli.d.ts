/// <reference types="node" />
import { EventEmitter2 } from "eventemitter2";
import { IOptionsDefinition, IArgumentsDefinition, ICommandsDefinition, IParsedOptionsDefinition, IOptionsDefinitionParser, IArgumentsDefinitionParser, IParsedArgumentsDefinition, IParsedCommandsDefinition, ICommandsDefinitionParser, IParsedArgv } from "../definitions";
import { ILog } from "./log";
import { IConfig } from "./config";
import { IDescriptor, IOutput } from "../io";
export declare abstract class Cli<T extends IOptionsDefinition, Y extends IParsedOptionsDefinition, Z extends IOptionsDefinitionParser> extends EventEmitter2 {
    argv: any[];
    parsed: Y;
    protected nodePath: string;
    protected binPath: string;
    config: IConfig;
    log: ILog;
    definition: T;
    out: IOutput;
    protected definitionParserFactory: (definition: T, args: IParsedArgv) => Z;
    protected _descriptor: IDescriptor;
    constructor();
    handle(): void;
    parse(argv: any[]): void;
    protected defineHelp(): void;
    protected readonly help: {
        enabled: boolean;
        key: string;
        command?: string;
    };
    showHelp(...without: string[]): void;
    exit(fail?: boolean): void;
    fail(msg?: string): void;
    profile(id: string, msg?: string, meta?: any, callback?: (err: Error, level: string, msg: string, meta: any) => void): void;
}
export declare class ArgumentsCli extends Cli<IArgumentsDefinition, IParsedArgumentsDefinition, IArgumentsDefinitionParser> {
    parse(argv: any[]): any;
}
export declare class CommandsCli extends Cli<ICommandsDefinition, IParsedCommandsDefinition, ICommandsDefinitionParser> {
    globalDefinition: IOptionsDefinition;
    protected globalDefinitionParserFactory: (definition: IOptionsDefinition, args: IParsedArgv) => IOptionsDefinitionParser;
    parse(argv: any[]): any;
    protected checkHelp(): any;
    handle(): any;
}
