import {injectable} from 'inversify';


export interface IInput
{
    ask(question: string): Promise<any>
}

@injectable()
export class Input implements IInput {
    noInteraction:boolean = false

    ask(question: string): Promise<any> {
        return undefined;
    }

}
export default Input
