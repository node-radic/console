import { inject, injectable, BINDINGS } from "../core";
import { IOutput } from "../io";
import { IDescriptor } from "../io/descriptor";
import { IConfig } from "../core/config";
import { ICommandFactory, ICommandRegistration, BaseCommandRegistration } from "./factory";
import { ICommandConstructor } from "./command";


export interface IGroup extends ICommandRegistration<IGroup>
{
    getChildren(): ICommandRegistration<IGroupConstructor|ICommandConstructor>[]
}

export interface IGroupConstructor
{
    new (): IGroup
}

@injectable()
export class Group extends BaseCommandRegistration implements IGroup
{

    name: string;
    desc: string;
    parent?: IGroupConstructor

    @inject(BINDINGS.OUTPUT)
    protected out: IOutput;

    @inject(BINDINGS.DESCRIPTOR)
    protected descriptor: IDescriptor;

    @inject(BINDINGS.CONFIG)
    protected config: IConfig

    @inject(BINDINGS.COMMANDS_FACTORY)
    protected factory: ICommandFactory

    showHelp() {
        this.out
            .title(this.name)
            .description(this.desc)
            .line()
            .header(this.config('descriptor.text.commands'));

        this.descriptor.group(this);
        this.out.line()
    }

    getChildren() {
        return this.factory.getGroupChildren(this.name, this.parent);
    }

    toString() {
        return this.name;
    }

}
