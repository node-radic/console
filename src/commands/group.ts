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
    prettyName: string;
    parent?: IGroupConstructor

    handle() {
        this.showHelp()
    }

    showHelp(title?:string, desc?:string) {
        this.out
            .title(title || this.prettyName)
            .description(desc || this.desc)
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
