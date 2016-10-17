import * as _s from "underscore.string";
import {inject, injectable, BINDINGS} from '../core'
import { IArgument, IArgumentsDefinition} from "../definitions";




@injectable()
/**
 * This class is responsible for transforming "signature" strings into definitions.
 */
export class DefinitionSignatureParser
{
    @inject(BINDINGS.ARGUMENTS_DEFINITION)
    definition: IArgumentsDefinition

    public signature: string;

    parse(signature: string): IArgumentsDefinition {
        this.signature = signature;
        let exp        = /\{\s*(.*?)\s*\}/g;
        let match;
        while ((match = exp.exec(signature)) !== null) {
            let token = match[1].toString()
            if (token.startsWith('-')) {
                this.parseOption(token)
            } else {
                this.parseArgument(token);
            }
        }
        return this.definition;
    }


    protected parseArgument(token: string|any) {
        // {name:The required name} {email?:The optional email}
        let desc = '';
        if (_s.contains(token, ':')) {
            token = (<string> token).split(':');
            desc  = token[1].trim();
            token = token[0].toString()
        }

        let arg = <IArgument> {name: token, description: desc, required: false, type: 'string', default: null}

        // suggest to make it work more with regex for more advanced signatures:
        // https://regex101.com/r/aK6wE0/1

        let exp = /(.+)\=(.+)/

        switch (true) {
            case _s.endsWith(token, '?*'):
                arg.name     = _s.rtrim(token, '?*')
                arg.type     = 'array';
                arg.required = false
                break;
            case _s.endsWith(token, '*'):
                arg.name     = _s.rtrim(token, '*')
                arg.type     = 'array'
                arg.required = true;
                break;
            case _s.endsWith(token, '?'):
                arg.name = _s.rtrim(token, '?')
                break;
            case exp.test(token):
                arg.required = false
                arg.name     = token.match(exp)[1]
                arg.default  = token.match(exp)[2]
                break;
            default:
                arg.required = true
        }

        this.definition.argument(arg.name, arg.description, arg.required, arg.type, arg.default);


    }

    protected  parseOption(token: string) {
        let [_names, description] = token.split(':');
        let names                 = _names.split('|').map((name: string) => {
            return name.replace(/\-/g, '');
        });
        let name                  = names.shift();
        // this.options[name]        = {
        //     name       : name,
        //     aliases    : names,
        //     description: description
        // }
        // names.forEach((alias: string) => this.options[alias] = name)
    }
}
