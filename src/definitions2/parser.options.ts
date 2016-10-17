import { merge, clone } from "lodash";
import { inject, injectable, BINDINGS } from "../core";
import { defined } from "@radic/util";
import { IOptionsDefinition } from "./definition.options";
import { IParsedArgv, parseArgv } from "./parser.argv";


export interface IParsedOptionsDefinition {
    argv: any[]
    definition: IOptionsDefinition
    args: IParsedArgv

    options: {[name: string]: any}
    errors: string[]

    nopts: number

    hasOpt(n: string): boolean
    opt(n: string): any

    hasErrors(): boolean

    help: {enabled: boolean, show: boolean, key: string}

    global?: IParsedOptionsDefinition
}
export interface IOptionsDefinitionParser {
    definition: IOptionsDefinition
    argv: any[]

    parse(): IParsedOptionsDefinition
}

@injectable()
export class ParsedOptionsDefinition implements IParsedOptionsDefinition {
    help: {enabled: boolean; show: boolean; key: string} = { enabled: false, show: false, key: undefined }
    options: {[name: string]: any}                       = {};
    argv: any[]
    errors: string[]                                     = [];

    definition: IOptionsDefinition
    args: IParsedArgv

    hasOpt(n: string): boolean {
        return this.options[ n ] !== undefined
    }

    /** The number of options given */
    get nopts(): number {
        return Object.keys(this.options).length
    }

    opt(n: string): any {
        if ( false === this.hasOpt(n) ) return false;
        return this.options[ n ];
    }

    hasErrors(): boolean {
        return this.errors.length > 0;
    }
}

@injectable()
/**
 * Parses a Definition and Argv and produces a ParsedDefinition
 * @
 */
export class OptionsDefinitionParser implements IOptionsDefinitionParser {
    @inject(BINDINGS.PARSED_OPTIONS_DEFINITION)
    public parsed: IParsedOptionsDefinition
    public definition: IOptionsDefinition
    public argv: any[]
    //public _: string[]

    protected args: IParsedArgv
    protected errors: string[] = [];
    protected options: {[name: string]: any}


    parse(): IParsedOptionsDefinition {
        // first let yargs-parser make sense of it
        this.args = parseArgv(this.argv, this.definition.getOptions());

        // adjust the results / make our own representations of the options and arguments.
        this.parseOptions();

        // and build the parsed defintion from that
        this.parsed.argv       = this.argv;
        this.parsed.args       = this.args;
        this.parsed.errors     = this.errors;
        this.parsed.definition = this.definition;
        this.parsed.options    = this.options;

        // and the help stuff
        this.parsed.help.enabled = this.definition.hasHelp()
        this.parsed.help.key     = this.definition.getHelpKey();
        this.parsed.help.show    = this.parsed.opt(this.parsed.help.key) === true

        // and return it :)
        return this.parsed;
    }

    protected parseOptions() {
        // re-apply "nested" options defaults
        this.definition.getOptions().nested.forEach((key: string) => {
            let defaults          = this.definition.getOptions().default[ key ];
            let aliases           = this.args.aliases[ key ];
            this.args.argv[ key ] = merge({}, defaults, this.args.argv[ key ]);
            aliases.forEach((alias) => this.args.argv[ alias ] = merge({}, defaults, this.args.argv[ alias ]))
        })

        // clone the argv and remove the arguments from it, resulting in all the options
        let options = clone(this.args.argv);
        delete options._
        this.options = options;
    }

}



