import {merge} from 'lodash';
import {OptionsDefinition, IOptionsDefinition} from "./definition.options";

export interface IArgument
{
    name?: string
    required?: boolean
    default?: any
    type?: string
    description?: string
    value?: any
}

export interface IArgumentsDefinition extends IOptionsDefinition
{
    argument(name: string, desc?: string, required?: boolean, type?: string, def?: any): this
    arguments(args: any): this
    getArguments(): {[name: string]: IArgument}
    mergeArguments(definition: this): this
    hasArguments(): boolean
}

export class ArgumentsDefinition extends OptionsDefinition implements IArgumentsDefinition {

    protected _arguments: {[name: string]: IArgument}

    reset(){
        super.reset();
        this._arguments = {}
    }

    mergeArguments(definition: this): this {
        merge(this._arguments, definition.getArguments());
        return this;
    }

    getArguments(): {[name: string]: IArgument} {
        return this._arguments;
    }

    argument(name: string, desc: string = '', required: boolean = false, type: string = 'string', def: any = null): this {
        this._arguments[name] = <IArgument> {required, type, default: def};
        return this

    }

    arguments(args: any): this {
        if (typeof args === 'string') {
            // let def = app.get<DefinitionSignatureParser>(BINDINGS.DEFINITION_SIGNATURE_PARSER).parse(args);
            // this.mergeArguments(<any> def);
        } else {
            Object.keys(args).forEach((name: string) => {
                let arg:IArgument = merge({required: false, default: null, type: 'string'}, args[name]);
                this.argument(name, arg.description, arg.required, arg.type, arg.default);
            })
        }
        return this
    }

    hasArguments(): boolean {
        return Object.keys(this._arguments).length > 0;
    }
}
