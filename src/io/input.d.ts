export interface IInput {
    ask(question: string): Promise<any>;
}
export declare class Input implements IInput {
    noInteraction: boolean;
    ask(question: string): Promise<any>;
}
export default Input;
