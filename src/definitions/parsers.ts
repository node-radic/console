import { upperFirst, merge, clone } from "lodash";
import { Config, defined } from "@radic/util";
import { IConfig, inject, injectable, BINDINGS } from "../core";
import { IOptionsDefinition, IArgumentsDefinition, ICommandsDefinition, CommandsDefinition } from "./definitions";
import { IParsedArgv, parseArgv } from "./argv";
import { ICommandFactory } from "../commands";
import { IParsedOptionsDefinition, IParsedArgumentsDefinition, IParsedCommandsDefinition } from "./parsed";


export interface IOptionsDefinitionParser {
    definition: IOptionsDefinition
    argv: any[]

    parse(): IParsedOptionsDefinition
}
export interface IArgumentsDefinitionParser extends IOptionsDefinitionParser {
    definition: IArgumentsDefinition
    parse(): IParsedArgumentsDefinition
}
export interface ICommandsDefinitionParser extends IOptionsDefinitionParser {
    definition: ICommandsDefinition
    parse(): IParsedCommandsDefinition
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

@injectable()
/**
 * Parses a Definition and Argv and produces a ParsedDefinition
 */
export class ArgumentsDefinitionParser extends OptionsDefinitionParser implements IArgumentsDefinitionParser {
    @inject(BINDINGS.PARSED_ARGUMENTS_DEFINITION)
    public parsed: IParsedArgumentsDefinition
    public definition: IArgumentsDefinition
    protected arguments: {[name: string]: any}


    parse(): IParsedArgumentsDefinition {
        super.parse();
        // adjust the results / make our own representations of the options and arguments.
        this.parseArguments();

        this.parsed.arguments = this.arguments;

        // and return it :)
        return this.parsed;
    }

    protected parseArguments() {
        let all    = this.definition.getArguments();
        // let names = Object.keys(all);
        let input  = {};
        let args   = clone(this.args.argv._);
        let errors = [];

        // Associate arguments with values
        Object.keys(all).forEach((name: string, i: number) => {
            if ( i > args.length - 1 ) {
                if ( all[ name ].required ) return this.errors.push(`The argument [${name}] is required`)
                input[ name ] = all[ name ].default;
            } else {
                input[ name ] = args[ i ]
            }
        })

        this.arguments = input;
    }

}

@injectable()
/**
 * Parses a Definition and Argv and produces a ParsedDefinition
 */
export class CommandsDefinitionParser extends OptionsDefinitionParser implements ICommandsDefinitionParser {
    @inject(BINDINGS.PARSED_COMMANDS_DEFINITION)
    public parsed: IParsedCommandsDefinition

    public definition: ICommandsDefinition

    @inject(BINDINGS.GLOBAL_DEFINITION)
    globalDefinition: IOptionsDefinition

    @inject(BINDINGS.COMMANDS_FACTORY)
    factory: ICommandFactory

    @inject(BINDINGS.CONFIG)
    config: IConfig

    /** The full command and arguments that we need to resolve */
    protected query: string[];

    parse(): IParsedCommandsDefinition {
        super.parse();
        if ( this.definition instanceof CommandsDefinition === false ) return this.parsed
        this.query = clone(this.args.argv._);

        let tree               = this.factory.getTree();
        this.parsed.definition = this.definition;
        this.parsed.isRoot     = this.query.length === 0;

        if ( this.parsed.help.enabled && this.parsed.isRoot && this.config('descriptor.cli.showHelpAsDefault') ) {
            this.parsed.help.show = true
        }
        let resolved = this.factory.resolveFromArray(this.query);
        if ( resolved ) {
            this.parsed.isCommand        = resolved.type === 'command'
            this.parsed.isGroup          = resolved.type === 'group'
            this.parsed[ resolved.type ] = this.factory[ 'create' + upperFirst(resolved.type) ](resolved);
            if ( this.parsed.isCommand ) {
                this.parsed.command.argv = this.query
            }
        }

        return this.parsed;
    }

}

