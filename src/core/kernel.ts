import { inject, Kernel as BaseKernel, decorate, injectable, interfaces as inversifyInterfaces } from "inversify";
import { makeProvideDecorator,makeFluentProvideDecorator } from "inversify-binding-decorators";
import getDecorators from "inversify-inject-decorators";
import BINDINGS from "./bindings";
import { CommandsCli, ArgumentsCli } from "./cli";
import { ILog, Log } from "./log";
import { IConfig, config } from "./config";
import { IDescriptor, IInput, IOutput, Descriptor, Input, Output } from "../io";
import { IOptionsDefinition, ICommandsDefinition, IArgumentsDefinition, OptionsDefinition, CommandsDefinition, ArgumentsDefinition, IOptionsParser, OptionsDefinitionParser, ParsedOptionsDefinition, IParsedOptions, IArgumentsParser, ArgumentsDefinitionParser, IParsedArguments, ParsedArgumentsDefinition, ICommandsParser, CommandsDefinitionParser, IParsedCommands, ParsedCommandsDefinition, DefinitionSignatureParser } from "../definitions";
import { ICommandFactory, CommandFactory } from "../commands";
import { IHelpers, Helpers } from "./helpers";

// import {kindOf} from '@radic/util'
import Factory = inversifyInterfaces.Factory
import Context = inversifyInterfaces.Context


export class ConsoleKernel extends BaseKernel
{
    /**
     * Create an instance of a class using the container, making it injectable at runtime and able to @inject on the fly
     * @param cls
     * @returns {T}
     */
    build<T>(cls: any): T {
        this.ensureInjectable(cls);
        let k = 'temporary.kernel.binding'
        this.bind(k).to(cls);
        let instance = this.get<T>(k)
        this.unbind(k)
        return instance;
    }

    /**
     * make binds the class in the IoC container if not already bound. then returns the bound instance
     *
     * @param cls
     * @returns {T}
     */
    make<T>(cls: any): T {
        this.ensureInjectable(cls);
        let binding = cls.toString()
        if ( this.isBound(binding) ) {
            return this.get<T>(binding)
        }
        this.bind(binding).to(cls);
        return this.get<T>(binding)
    }

    protected ensureInjectable(cls:Function){
        try { decorate(injectable(), cls); } catch ( err ) {}
    }

    Cli<CLS,DEF,DEFPARSER extends IOptionsParser>(cls: any, def: any): CLS {
        this.bindKernel(this);
        this.bind<DEF>(BINDINGS.ROOT_DEFINITION).to(def).inSingletonScope()
        // this.bindParserFactory<DEFPARSER>(BINDINGS.ROOT_DEFINITION_PARSER_FACTORY, defparser)
        this.bind<CLS>(BINDINGS.CLI).to(cls).inSingletonScope();
        return this.get<CLS>(BINDINGS.CLI);
    }

    commandsCli(): CommandsCli {
        return this.Cli<CommandsCli,ICommandsDefinition, ICommandsParser>(CommandsCli, CommandsDefinition)
    }

    argumentsCli(): ArgumentsCli {
        return this.Cli<ArgumentsCli ,ICommandsDefinition, ICommandsParser>(ArgumentsCli , CommandsDefinition)
        // if ( this.isBound(BINDINGS.CLI) ) throw Error('cli already created')
        // this.bindKernel(this);
        // this.bind<IArgumentsDefinition>(BINDINGS.ROOT_DEFINITION).to(ArgumentsDefinition).inSingletonScope();
        // this.bindParserFactory<IArgumentsDefinitionParser>(BINDINGS.ROOT_DEFINITION_PARSER_FACTORY, BINDINGS.ARGUMENTS_DEFINITION_PARSER)
        // this.bind<ArgumentsCli>(BINDINGS.CLI).to(ArgumentsCli).inSingletonScope();
        // return this.get<ArgumentsCli>(BINDINGS.CLI);
    }

    bindKernel(kernel: ConsoleKernel) {

        // @TODO use kernel modules instead: https://github.com/inversify/InversifyJS/blob/master/wiki/kernel_modules.md
        // @TODO might want to use @provide for some of these

        kernel.bind<IOptionsDefinition>(BINDINGS.GLOBAL_DEFINITION).to(OptionsDefinition).inSingletonScope();
        kernel.bind<ILog>(BINDINGS.LOG).to(Log).inSingletonScope();
        kernel.bind<IDescriptor>(BINDINGS.DESCRIPTOR).to(Descriptor).inSingletonScope();
        kernel.bind<IConfig>(BINDINGS.CONFIG).toConstantValue(config);
        kernel.bind<ICommandFactory>(BINDINGS.COMMANDS_FACTORY).to(CommandFactory).inSingletonScope();

        kernel.bind<IInput>(BINDINGS.INPUT).to(Input);
        kernel.bind<IOutput>(BINDINGS.OUTPUT).to(Output);
        kernel.bind<IHelpers>(BINDINGS.HELPERS).to(Helpers);



        kernel.bind<IOptionsDefinition>(BINDINGS.OPTIONS_DEFINITION).to(OptionsDefinition);
        kernel.bind<IArgumentsDefinition>(BINDINGS.ARGUMENTS_DEFINITION).to(ArgumentsDefinition);
        kernel.bind<ICommandsDefinition>(BINDINGS.COMMANDS_DEFINITION).to(CommandsDefinition);


        kernel.bind<IOptionsParser>(BINDINGS.OPTIONS_DEFINITION_PARSER).to(OptionsDefinitionParser);
        kernel.bind<IArgumentsParser>(BINDINGS.ARGUMENTS_DEFINITION_PARSER).to(ArgumentsDefinitionParser);
        kernel.bind<ICommandsParser>(BINDINGS.COMMANDS_DEFINITION_PARSER).to(CommandsDefinitionParser);


        kernel.bind<IParsedOptions>(BINDINGS.PARSED_OPTIONS_DEFINITION).to(ParsedOptionsDefinition);
        kernel.bind<IParsedArguments>(BINDINGS.PARSED_ARGUMENTS_DEFINITION).to(ParsedArgumentsDefinition);
        kernel.bind<IParsedCommands>(BINDINGS.PARSED_COMMANDS_DEFINITION).to(ParsedCommandsDefinition);

        kernel.bind<DefinitionSignatureParser>(BINDINGS.DEFINITION_SIGNATURE_PARSER).to(DefinitionSignatureParser);

        // kernel.bind<Factory<IOptionsDefinitionParser>>(BINDINGS.OPTIONS_DEFINITION_PARSER_FACTORY).toFactory<any>((context: Context) => {
        //     return (definition: any, argv: any[]) => {-
        //         let parser        = context.kernel.get<IOptionsDefinitionParser>(BINDINGS.OPTIONS_DEFINITION_PARSER);
        //         parser.definition = definition;
        //         parser.argv       = argv;
        //         return parser;
        //     }
        // });
        //
        // kernel.bind<Factory<IArgumentsDefinitionParser>>(BINDINGS.ARGUMENTS_DEFINITION_PARSER_FACTORY).toFactory<any>((context: Context) => {
        //     return (definition: any, argv: any[]) => {
        //         let parser        = context.kernel.get<IArgumentsDefinitionParser>(BINDINGS.ARGUMENTS_DEFINITION_PARSER);
        //         parser.definition = definition;
        //         parser.argv       = argv;
        //         return parser;
        //     }
        // // });
        // this.bindParserFactory<IOptionsDefinitionParser>(BINDINGS.OPTIONS_DEFINITION_PARSER_FACTORY, BINDINGS.OPTIONS_DEFINITION_PARSER)
        // // this.bindParserFactory<IArgumentsDefinitionParser>(BINDINGS.ARGUMENTS_DEFINITION_PARSER_FACTORY, BINDINGS.ARGUMENTS_DEFINITION_PARSER)
        // this.bindParserFactory<ICommandsDefinitionParser>(BINDINGS.COMMANDS_DEFINITION_PARSER_FACTORY, BINDINGS.COMMANDS_DEFINITION_PARSER)
        // this.bind<Factory<IArgumentsDefinitionParser>>(BINDINGS.ARGUMENTS_DEFINITION_PARSER_FACTORY).toFactory<IArgumentsDefinitionParser>((context: Context) => {
        //     return (definition: any, argv: any[]) : IArgumentsDefinitionParser => {
        //         let parser        = context.kernel.build<IArgumentsDefinitionParser>(BINDINGS.ARGUMENTS_DEFINITION_PARSER);
        //         parser.definition = definition;
        //         parser.argv       = argv;
        //         return parser;
        //     }
        // });

    }

    // private bindParserFactory<T2 extends IOptionsDefinitionParser>(binding, parserBinding) {
    //     this.bind<Factory<T2>>(binding).toFactory<any>((context: Context) => {
    //         return (definition: any, argv: any[]) => {
    //             let parser        = context.kernel.get<T2>(parserBinding);
    //             parser.definition = definition;
    //             parser.argv       = argv;
    //             return parser;
    //         }
    //     });
    // }

}

let kernel    = new ConsoleKernel;
let { lazyInject }   = getDecorators(kernel);
let provide          = makeProvideDecorator(kernel);
let fprovide = makeFluentProvideDecorator(kernel)
let provideSingleton = function (identifier) {
    return fprovide(identifier).inSingletonScope().done()
};

export { kernel, lazyInject, provide, provideSingleton, inject, injectable, decorate}

