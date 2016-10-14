import {EventEmitter} from "events";
import {existsSync} from "fs-extra";
import {BINDINGS} from "./bindings";
import {injectable, decorate, inject} from "./";
import {IOptionsDefinition, IArgumentsDefinition, ICommandsDefinition, IParsedOptionsDefinition, IOptionsDefinitionParser, IArgumentsDefinitionParser, IParsedArgumentsDefinition, IParsedCommandsDefinition, ICommandsDefinitionParser, IParsedArgv} from "../definitions";
import {ILog} from "./log";
import {IConfig} from "./config";
import {app} from "./app";
import {IDescriptor} from "../io/descriptor";
import {IOutput} from "../io/output";

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
    //get config(): IConfig { return this._config }

    @inject(BINDINGS.LOG)
    log: ILog;
    //get log(): ILog { return this._log }

    @inject(BINDINGS.ROOT_DEFINITION)
    definition: T;
    // get definition(): T { return this._definition }

    @inject(BINDINGS.OUTPUT)
    out:IOutput;
    // get out() : IOutput { return this._out }

    @inject(BINDINGS.ROOT_DEFINITION_PARSER_FACTORY)
    protected definitionParserFactory: (definition: T, args: IParsedArgv) => Z

    @inject(BINDINGS.DESCRIPTOR)
    protected _descriptor:IDescriptor

    constructor() {
        super()
    }

    parse(argv: any[]) {
        if (this.argv) return;
        this.emit('parse');

        // strip node and file path first if needed
        if (existsSync(argv[0])) {
            this.nodePath = argv.shift();
            this.binPath  = argv.shift();
        }

        this.argv = argv;
    }


    showHelp(...without: string[]) {
        let descriptor = app.get<IDescriptor>(BINDINGS.DESCRIPTOR);
        descriptor.cli(this);
    }

    exit(fail: boolean = false) {
        process.exit(fail ? 1 : 0)
    }

    fail(msg?: string) {
        if (msg) this.log.error(msg)
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
        let definitionParser = this.definitionParserFactory(this.definition, this.argv);
        this.parsed          = definitionParser.parse();
        if (this.definition.isHelpEnabled() && this.parsed.opt(this.definition.helpKey) === true) {
            this.showHelp();
            this.exit();
        }
        // re-apply "nested" options defaults
        // this.definition.getOptions().nested.forEach((key:string) => {
        //     let defaults = this.definition.getOptions().default[key];
        //     let aliases = this._args.aliases[key];
        //     this._args.argv[key] = merge({}, defaults, this._args.argv[key]);
        //     aliases.forEach((alias) => this._args.argv[alias] = merge({}, defaults, this._args.argv[alias]))
        // })
        // let dp     = new DefinitionParser(this.definition, this._args);
        // let parsed = dp.parseArguments();
        // if (parsed.errors.length > 0) {
        //     parsed.errors.forEach((error: any, i: number) => {
        //         console.error(`Error [${i+1}/${parsed.errors.length}] parsing argument [${error.argument}]: ${error.message}`)
        //     })
        // }
        // return parsed;
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
        let parser  = this.definitionParserFactory(this.definition, this.argv);
        this.parsed = parser.parse();

        let gparser        = this.globalDefinitionParserFactory(this.globalDefinition, this.argv);
        this.parsed.global = gparser.parse();

        if (this.definition.isHelpEnabled() && this.parsed.opt(this.definition.helpKey) === true) {
            this.showHelp();
            this.exit();
        }
    }

    getGlobalDefinition(): IOptionsDefinition {
        return this.globalDefinition;
    }
}
