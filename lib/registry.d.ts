/// <reference types="lodash" />
import * as _ from 'lodash';
import { GroupConfig, CommandConfig, CliChildConfig } from "./cli-children";
import { CliMode } from "./cli";
export declare class Registry {
    readonly commands: _.LoDashExplicitArrayWrapper<CommandConfig>;
    readonly groups: _.LoDashExplicitArrayWrapper<GroupConfig>;
    private _groups;
    private _commands;
    private _rootGroup;
    private _rootCommand;
    constructor();
    getRoot(mode: CliMode): CliChildConfig;
    protected createGroup(options?: GroupConfig): GroupConfig;
    protected createCommand(options?: CommandConfig): CommandConfig;
    addGroup(options?: GroupConfig): GroupConfig;
    addCommand(options?: CommandConfig): CommandConfig;
    private static _instance;
    private static readonly instance;
    protected static makeOptions<T extends CliChildConfig>(cls: any, args: any[]): T;
    static command(name: string): ClassDecorator;
    static command(options: CommandConfig): ClassDecorator;
    static command(name: string, options: CommandConfig): ClassDecorator;
    static group(name: string): ClassDecorator;
    static group(options: GroupConfig): ClassDecorator;
    static group(name: string, options: GroupConfig): ClassDecorator;
}
