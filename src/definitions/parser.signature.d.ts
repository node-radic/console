import { IArgumentsDefinition } from "../definitions";
export declare class DefinitionSignatureParser {
    definition: IArgumentsDefinition;
    signature: string;
    parse(signature: string): IArgumentsDefinition;
    protected parseArgument(token: string | any): void;
    protected parseOption(token: string): void;
}
