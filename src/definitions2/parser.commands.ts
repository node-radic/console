import { injectable, inject } from "../core";
import { ICommandsDefinition, CommandsDefinition } from "./definition.commands";
import { IParsedOptionsDefinition, IOptionsDefinitionParser, ParsedOptionsDefinition, OptionsDefinitionParser } from "./parser.options";
import { BINDINGS } from "../core/bindings";
import { upperFirst, clone } from "lodash";
import { Config } from "@radic/util";
import { Command, Group, ICommandFactory, ICommandRegistration } from "../commands";
import { ICommandConstructor } from "../commands/command";
import { IConfig } from "../core/config";
import { IOptionsDefinition } from "./definition.options";

export interface IParsedCommandsDefinition extends IParsedOptionsDefinition
{
    definition: ICommandsDefinition
    isCommand: boolean
    isGroup: boolean
    isRoot: boolean
    command: Command
    group: Group
}

export interface ICommandsDefinitionParser extends IOptionsDefinitionParser
{
    definition: ICommandsDefinition
    parse(): IParsedCommandsDefinition
}

@injectable()
export class ParsedCommandsDefinition extends ParsedOptionsDefinition implements IParsedCommandsDefinition
{
    definition: ICommandsDefinition
    isRoot: boolean    = false;
    isCommand: boolean = false
    isGroup: boolean   = false
    command: Command
    group: Group
}

@injectable()
/**
 * Parses a Definition and Argv and produces a ParsedDefinition
 */
export class CommandsDefinitionParser extends OptionsDefinitionParser implements ICommandsDefinitionParser
{
    @inject(BINDINGS.PARSED_COMMANDS_DEFINITION)
    public parsed: IParsedCommandsDefinition

    public definition: ICommandsDefinition

    @inject(BINDINGS.GLOBAL_DEFINITION)
    globalDefinition: IOptionsDefinition

    @inject(BINDINGS.COMMANDS_FACTORY)
    factory: ICommandFactory

    @inject(BINDINGS.CONFIG)
    config : IConfig

    /** The full command and arguments that we need to resolve */
    protected query: string[];

    parse(): IParsedCommandsDefinition {
        super.parse();
        if ( this.definition instanceof CommandsDefinition === false ) return this.parsed
        this.query    = clone(this.args.argv._);

        let tree               = this.factory.getTree();
        this.parsed.definition = this.definition;
        this.parsed.isRoot = this.query.length === 0;

        if ( this.parsed.help.enabled && this.parsed.isRoot && this.config('descriptor.cli.showHelpAsDefault') ) {
            this.parsed.help.show = true
        }
        let resolved = this.factory.resolveFromArray(this.query);
        if(resolved){
            this.parsed.isCommand = resolved.type === 'command'
            this.parsed.isGroup = resolved.type === 'group'
            this.parsed[resolved.type] = this.factory['create' + upperFirst(resolved.type)](resolved);
            if(this.parsed.isCommand){
                this.parsed.command.argv = this.query
            }
        }

        return this.parsed;
    }

}
