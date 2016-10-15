import { IOutput } from "../io";
import { IDescriptor } from "../io/descriptor";
import { IConfig } from "../core/config";
import { ICommandFactory, ICommandRegistration, BaseCommandRegistration } from "./factory";
import { ICommandConstructor } from "./command";
export interface IGroup extends ICommandRegistration<IGroup> {
    getChildren(): ICommandRegistration<IGroupConstructor | ICommandConstructor>[];
}
export interface IGroupConstructor {
    new (): IGroup;
}
export declare class Group extends BaseCommandRegistration implements IGroup {
    name: string;
    desc: string;
    parent?: IGroupConstructor;
    protected out: IOutput;
    protected descriptor: IDescriptor;
    protected config: IConfig;
    protected factory: ICommandFactory;
    showHelp(): void;
    getChildren(): ICommandRegistration<ICommandConstructor | IGroupConstructor>[];
    toString(): string;
}
