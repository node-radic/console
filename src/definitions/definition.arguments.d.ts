import { OptionsDefinition, IOptionsDefinition } from "./definition.options";
export interface IArgument {
    name?: string;
    required?: boolean;
    default?: any;
    type?: string;
    description?: string;
    value?: any;
}
export interface IArgumentsDefinition extends IOptionsDefinition {
    argument(name: string, desc?: string, required?: boolean, type?: string, def?: any): this;
    arguments(args: any): this;
    getArguments(): {
        [name: string]: IArgument;
    };
    mergeArguments(definition: this): this;
    hasArguments(): boolean;
}
export declare class ArgumentsDefinition extends OptionsDefinition implements IArgumentsDefinition {
    protected _arguments: {
        [name: string]: IArgument;
    };
    reset(): void;
    mergeArguments(definition: this): this;
    getArguments(): {
        [name: string]: IArgument;
    };
    argument(name: string, desc?: string, required?: boolean, type?: string, def?: any): this;
    arguments(args: any): this;
    hasArguments(): boolean;
}
