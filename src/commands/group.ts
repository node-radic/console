import { injectable } from "../core";
import { ICommandRegistration, BaseCommandRegistration } from "./factory";
import { ICommandConstructor } from "./command";


export interface IGroup extends ICommandRegistration<IGroup> {
    getChildren(): ICommandRegistration<IGroupConstructor|ICommandConstructor>[]
}

export interface IGroupConstructor {
    new (): IGroup
}

@injectable()
export class Group extends BaseCommandRegistration implements IGroup {

    name: string;
    desc: string;
    parent?: IGroupConstructor

    handle() {
        this.showHelp()
    }

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
