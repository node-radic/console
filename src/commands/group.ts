import {inject, injectable, BINDINGS} from "../core";
import {IOutput} from "../io";
import { IDescriptor } from "../io/descriptor";


export interface IGroup {
    name: string;
    desc: string;
    parent: IGroupConstructor
    showHelp()
}
export interface IGroupConstructor {
    new () : IGroup
}

@injectable()
export class Group implements IGroup
{

    name: string;
    desc: string;
    parent: IGroupConstructor

    @inject(BINDINGS.OUTPUT)
    protected output: IOutput;

    @inject(BINDINGS.DESCRIPTOR)
    protected descriptor: IDescriptor;


    showHelp() {
        this.descriptor.group(this);
    }

    toString(){
        return this.name;
    }
}
