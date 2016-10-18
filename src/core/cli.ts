import { EventEmitter2 } from "eventemitter2";
import { existsSync } from "fs-extra";
import { BINDINGS, ILog, IConfig, kernel, injectable, decorate, inject } from "./";
import { IOptionsDefinition, IArgumentsDefinition, ICommandsDefinition, IParsedOptionsDefinition, IOptionsDefinitionParser, IArgumentsDefinitionParser, IParsedArgumentsDefinition, IParsedCommandsDefinition, ICommandsDefinitionParser, IParsedArgv } from "../definitions";
import { IDescriptor, IOutput, IInput } from "../io";

decorate(injectable(), EventEmitter2);
@injectable()
export abstract class Cli<
    T extends IOptionsDefinition,
    Y extends IParsedOptionsDefinition,
    Z extends IOptionsDefinitionParser> extends EventEmitter2 {

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

    @inject(BINDINGS.INPUT)
    in: IInput;

    // @inject(BINDINGS.ROOT_DEFINITION_PARSER_FACTORY)
    // protected definitionParserFactory: (definition: T, args: IParsedArgv) => Z

    @inject(BINDINGS.DESCRIPTOR)
    descriptor: IDescriptor

    constructor() {
        super()
    }

    handle() {
        this.handleHelp();
        this.handleHandlerOptions();
    }

    protected handleHelp() {
        if ( this.parsed.help.show ) {
            this.showHelp()
            return this.exit()
        }
    }

    protected handleHandlerOptions() {
        Object.keys(this.definition.getJoinedOptions())
            .filter(this.parsed.hasOpt.bind(this.parsed))
            // .map(this.parsed.opt)
            .forEach((name: string) => {
                let handler = this.definition.getOptions().handler[ name ];
                if ( handler && handler.call(this) === false ) {
                    this.exit();
                }
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

        this.parsed = <Y> this.definition.parse(this.argv)
    }

    showHelp(...without: string[]) {

        let descriptor = kernel.get<IDescriptor>(BINDINGS.DESCRIPTOR);
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

export class ArgumentsCli extends Cli<IArgumentsDefinition, IParsedArgumentsDefinition, IArgumentsDefinitionParser> {
    parse(argv: any[]): any {
        super.parse(argv);
    }
}

export class CommandsCli extends Cli<ICommandsDefinition, IParsedCommandsDefinition, ICommandsDefinitionParser> {
    // @inject(BINDINGS.COMMANDS_DEFINITION)
    // definition: ICommandsDefinition

    @inject(BINDINGS.GLOBAL_DEFINITION)
    globalDefinition: IOptionsDefinition;

    constructor(){
        super()
    }

    parse(argv: any[]): any {
        super.parse(argv);
        // This works as follow
        // The root definition (options) will only work when a command has NOT been provided, eg: cli -h, cli -v
        // The root definition will resolve the command/group and put it into this.parsed.
        // When the command is fired (parsed.command.fire()), the command will parse it's own definition (options&arguments) (thus ignoring the root definition's options)
        // However, the global definition (options) will be merged into the command definition

        this.parsed.global = this.globalDefinition.parse(this.argv);


    }

    protected handleHelp(){
        super.handleHelp();
        if ( this.parsed.global.help.enabled && this.parsed.isRoot && this.config('descriptor.cli.showHelpAsDefault') ) {
            this.showHelp()
            return this.exit();
        }
    }

    handle(): any {
        super.handle();

        if ( this.parsed.isCommand ) {
            return this.parsed.command.fire()
        }

        if ( this.parsed.isGroup ) {
            return this.parsed.group.fire()
        }

        this.fail('No options or arguments provided.  Use the -h or --help option to show what can be done')
    }
}
