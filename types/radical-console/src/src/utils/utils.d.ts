/// <reference types="yargs-parser" />
import { YargsParserOptions } from "yargs-parser";
import { CommandArgumentConfig, CommandConfig, Dictionary, OptionConfig, ParsedCommandArguments } from "./interfaces";
/** */
export declare type CommandConfigFunction = <T extends CommandConfig>(cls: Function, args?: any[]) => T;
/** */
export declare type OptionConfigFunction = (cls: Object, key: string, args: any[]) => OptionConfig;
/** called in decorator, transforms config.name with all arguments to a proper structure */
export declare type PrepareArgumentsFunction = <T extends CommandConfig = CommandConfig>(config: T) => T;
/**
 * Transforms a OptionConfig array (usually found on CommandConfig) to yargs-parser options.
 * This is used on the `cli:parse` event (fired in Cli#parse) and cli:execute:parse (fired in Cli#executeCommand)
 *
 * @see {Cli)
 */
export declare type TransformOptionsFunction = (configs: OptionConfig[]) => YargsParserOptions;
/**
 * Used in the CLI, after parsing the argv, this arguments go to the handle for the command
 *
 * @param argv_
 * @param args
 * @returns {{arguments: {}, missing: Array, valid: boolean}}
 */
export declare type ParseArgumentsFunction = (argv_: string[], args?: CommandArgumentConfig[]) => ParsedCommandArguments;
/** */
export declare type TransformArgumentFunction = <T extends any = any>(val: any, arg: CommandArgumentConfig) => T | T[];
/** */
export declare type SubCommandsFindFunction = (filePath: string) => string[];
/** */
export declare type SubCommandsGetFunction = <T extends Dictionary<CommandConfig> | CommandConfig[]>(filePath: string, recursive?: boolean, asArray?: boolean) => T;
