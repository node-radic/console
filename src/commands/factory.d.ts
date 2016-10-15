import * as Promise from 'bluebird';
import { Command, ICommandConstructor } from "./command";
import { Group, IGroupConstructor } from "./group";
export interface ICommandRegistration<T> {
    name: string;
    desc: string;
    parent?: IGroupConstructor;
    cls?: T;
    type?: 'group' | 'command';
    showHelp?: () => void;
    toString?: () => string;
}
export interface IResolvedRegistration<T> extends ICommandRegistration<T> {
    arguments: string[];
    hasArguments: boolean;
    tree: any;
}
export declare function command(name: string, desc?: string, parent?: IGroupConstructor): (cls: ICommandConstructor) => void;
export declare function group(name: string, desc?: string, parent?: IGroupConstructor): (cls: IGroupConstructor) => void;
export interface ICommandFactory {
    groups: ICommandRegistration<IGroupConstructor>[];
    commands: ICommandRegistration<ICommandConstructor>[];
    addGroup(name: string, cls: IGroupConstructor, desc?: string, parent?: IGroupConstructor): any;
    addCommand(name: string, cls: ICommandConstructor, desc?: string, parent?: IGroupConstructor): any;
    createCommand(command: ICommandRegistration<ICommandConstructor>, argv?: any[]): Command;
    createGroup(group: ICommandRegistration<IGroupConstructor>): Group;
    getCommand(name: string, parent?: any): ICommandRegistration<ICommandConstructor>;
    getGroup(name: string, parent?: any): ICommandRegistration<IGroupConstructor>;
    getGroupChildren(name: string | null, parent?: any): ICommandRegistration<ICommandConstructor | IGroupConstructor>[];
    getTree(parent?: any): any[];
    resolveFromArray(arr: string[]): IResolvedRegistration<IGroupConstructor | ICommandConstructor>;
    resolveFromString(str: string): IResolvedRegistration<IGroupConstructor | ICommandConstructor>;
}
export declare abstract class BaseCommandRegistration {
    private defer;
    protected asyncMode: boolean;
    fire(): Promise<any>;
    protected async(): () => void;
    protected done(): void;
    protected fail(reason?: string): void;
    protected parse(): void;
}
export declare class CommandFactory implements ICommandFactory {
    readonly groups: ICommandRegistration<IGroupConstructor>[];
    readonly commands: ICommandRegistration<ICommandConstructor>[];
    getGroupChildren(name: string, parent?: any): ICommandRegistration<ICommandConstructor | IGroupConstructor>[];
    createCommand(commandRegistration: any, argv?: any[]): Command;
    createGroup(groupRegistration: any): Group;
    getTree(): any[];
    resolveFromArray(arr: string[]): IResolvedRegistration<IGroupConstructor | ICommandConstructor>;
    resolveFromString(resolvable: string): IResolvedRegistration<IGroupConstructor | ICommandConstructor>;
    protected unflatten(array: any, parent?: any, tree?: any[]): any[];
    getCommand(name: string, parent?: any): ICommandRegistration<ICommandConstructor>;
    getGroup(name: string, parent?: any): ICommandRegistration<IGroupConstructor>;
    addGroup(name: string, cls: IGroupConstructor, desc?: string, parent?: IGroupConstructor): void;
    addCommand(name: string, cls: ICommandConstructor, desc?: string, parent?: IGroupConstructor): void;
}
