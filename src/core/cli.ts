import { EventEmitter } from "events";
import { existsSync } from "fs-extra";
import { BINDINGS } from "./bindings";
import { injectable, decorate, inject } from "./";
import { IOptionsDefinition, IArgumentsDefinition, ICommandsDefinition, IParsedOptionsDefinition, IOptionsDefinitionParser, IArgumentsDefinitionParser, IParsedArgumentsDefinition, IParsedCommandsDefinition, ICommandsDefinitionParser, IParsedArgv } from "../definitions";
import { ILog } from "./log";
import { IConfig } from "./config";
import { app } from "./app";
import { IDescriptor, IOutput } from "../io";

decorate(injectable(), EventEmitter);
@injectable()
export abstract class Cli<
    T extends IOptionsDefinition,
    Y extends IParsedOptionsDefinition,
    Z extends IOptionsDefinitionParser> extends EventEmitter
{

    /** The original argv */
    public argv: any[]
    public parsed: Y

    protected nodePath: string;
    protected binPath: string;

    @inject(BINDINGS.CONFIG)
    config: IConfig

    @inject(BINDINGS.LOG)
    log: ILog;

    @inject(BINDINGS.ROOT_DEFINITION)
    definition: T;

    @inject(BINDINGS.OUTPUT)
    out: IOutput;

    @inject(BINDINGS.ROOT_DEFINITION_PARSER_FACTORY)
    protected definitionParserFactory: (definition: T, args: IParsedArgv) => Z

    @inject(BINDINGS.DESCRIPTOR)
    protected _descriptor: IDescriptor

    constructor() {
        super()
    }

    handle() {
        Object.keys(this.definition.getJoinedOptions())
            .filter(this.parsed.hasOpt.bind(this.parsed))
            // .map(this.parsed.opt)
            .forEach((name: string) => {
                let handler = this.definition.getOptions().handler[ name ];
                if ( handler ) handler.call(this)
            })

    }

    parse(argv: any[]) {
        if ( this.argv ) return;
        this.emit('parse');

        // strip node and file path first if needed
        if ( existsSync(argv[ 0 ]) ) {
            this.nodePath = argv.shift();
            this.binPath  = argv.shift();
        }

        this.argv = argv;

        if ( this.help.enabled ) {
            this.defineHelp()
        }

        let parser  = this.definitionParserFactory(this.definition, this.argv);
        this.parsed = <Y> parser.parse();
    }

    protected defineHelp() {
        this.definition.boolean(this.help.key)
        if(this.help.command) this.definition.alias(this.help.command)
    }

    protected get help(): {enabled: boolean,key: string,command?: string} {
        return this.config('help');
    }


    showHelp(...without: string[]) {

        let descriptor = app.get<IDescriptor>(BINDINGS.DESCRIPTOR);
        descriptor.cli(this);
    }

    exit(fail: boolean = false) {
        process.exit(fail ? 1 : 0)
    }

    fail(msg?: string) {
        if ( msg ) this.log.error(msg)
        this.exit(true);
    }

    profile(id: string, msg?: string, meta?: any, callback?: (err: Error, level: string, msg: string, meta: any) => void) {
        this.log.profile.apply(this.log, arguments)
    }
}

export class ArgumentsCli extends Cli<IArgumentsDefinition, IParsedArgumentsDefinition, IArgumentsDefinitionParser>
{
    parse(argv: any[]): any {
        super.parse(argv);
    }
}

export class CommandsCli extends Cli<ICommandsDefinition, IParsedCommandsDefinition, ICommandsDefinitionParser>
{
    @inject(BINDINGS.GLOBAL_DEFINITION)
    globalDefinition: IOptionsDefinition;

    @inject(BINDINGS.OPTIONS_DEFINITION_PARSER_FACTORY)
    protected globalDefinitionParserFactory: (definition: IOptionsDefinition, args: IParsedArgv) => IOptionsDefinitionParser

    parse(argv: any[]): any {
        super.parse(argv);
        // This works as follow
        // The root definition (options) will only work when a command has NOT been provided, eg: cli -h, cli -v
        // The root definition will resolve the command/group and put it into this.parsed.
        // When the command is fired (parsed.command.fire()), the command will parse it's own definition (options&arguments) (thus ignoring the root definition's options)
        // However, the global definition (options) will be merged into the command definition


        let gparser        = this.globalDefinitionParserFactory(this.globalDefinition, this.argv);
        this.parsed.global = gparser.parse();
    }


    protected checkHelp(): any {
        let help = this.config('help');
        if ( help.enabled ) {
            this.globalDefinition.option(help.key, { alias: help.command })
        }
    }

    handle(): any {

        if ( this.parsed.isRoot ) {
            // let showHelp = && this.parsed.opt(this.config('help.key')) === true
            if ( this.config('help.enabled') && this.config('descriptor.cli.showHelpAsDefault') ? this.showHelp() : super.handle()
                return this.exit();
        }

        if ( this.parsed.isCommand ) {
            return this.parsed.command.fire().then(() => {
                this.exit();
            });
        }

        if ( this.parsed.isGroup ) {
            return this.parsed.group.fire().then(() => {
                this.exit();
            });
        }

        this.fail('No options or arguments provided.  Use the -h or --help option to show what can be done')
    }
}
