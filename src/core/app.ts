import {Kernel, decorate, injectable, interfaces as inversifyInterfaces} from "inversify";
import BINDINGS from "./bindings";
import {} from "../definitions";
import {CommandsCli, ArgumentsCli} from "./cli";
import {ILog, Log} from "./log";
import {IConfig, Config, config} from './config'
import {IDescriptor, IInput, IOutput, Descriptor, Input, Output} from "../io";
import {
    // Definitions
    IOptionsDefinition, ICommandsDefinition, IArgumentsDefinition, OptionsDefinition, CommandsDefinition, ArgumentsDefinition,
    // Definition parsers
    IOptionsDefinitionParser, OptionsDefinitionParser, ParsedOptionsDefinition, IParsedOptionsDefinition,
    IArgumentsDefinitionParser, ArgumentsDefinitionParser, IParsedArgumentsDefinition, ParsedArgumentsDefinition,
    ICommandsDefinitionParser, CommandsDefinitionParser, IParsedCommandsDefinition, ParsedCommandsDefinition,
    DefinitionSignatureParser
} from "../definitions";
import { ICommandFactory, CommandFactory } from "../commands";

// import {kindOf} from '@radic/util'
import Factory = inversifyInterfaces.Factory
import Context = inversifyInterfaces.Context

class App extends Kernel
{
    make<T>(cls: any): T {
        decorate(injectable(), cls);
        let k = 'temporary.kernel.binding'
        this.bind(k).to(cls);
        let instance = this.get<T>(k)
        this.unbind(k)
        return instance;
    }

    commandsCli(): CommandsCli {
        if (this.isBound(BINDINGS.CLI)) throw Error('cli already created')
        this.bindKernel(this);
        this.bind<ICommandsDefinition>(BINDINGS.ROOT_DEFINITION).to(CommandsDefinition).inSingletonScope();
        this.bindParserFactory<ICommandsDefinitionParser>(BINDINGS.ROOT_DEFINITION_PARSER_FACTORY, BINDINGS.COMMANDS_DEFINITION_PARSER)
        this.bind<CommandsCli>(BINDINGS.CLI).to(CommandsCli).inSingletonScope();
        return this.get<CommandsCli>(BINDINGS.CLI);
    }

    argumentsCli(): ArgumentsCli {
        if (this.isBound(BINDINGS.CLI)) throw Error('cli already created')
        this.bindKernel(this);
        this.bind<IArgumentsDefinition>(BINDINGS.ROOT_DEFINITION).to(ArgumentsDefinition).inSingletonScope();
        this.bindParserFactory<IArgumentsDefinitionParser>(BINDINGS.ROOT_DEFINITION_PARSER_FACTORY, BINDINGS.ARGUMENTS_DEFINITION_PARSER)
        this.bind<ArgumentsCli>(BINDINGS.CLI).to(ArgumentsCli).inSingletonScope();
        return this.get<ArgumentsCli>(BINDINGS.CLI);
    }

    bindKernel(kernel: App) {

        // @TODO use kernel modules instead: https://github.com/inversify/InversifyJS/blob/master/wiki/kernel_modules.md

        kernel.bind<IOptionsDefinition>(BINDINGS.GLOBAL_DEFINITION).to(OptionsDefinition).inSingletonScope();
        kernel.bind<ILog>(BINDINGS.LOG).to(Log).inSingletonScope();
        kernel.bind<IDescriptor>(BINDINGS.DESCRIPTOR).to(Descriptor).inSingletonScope();
        kernel.bind<IConfig>(BINDINGS.CONFIG).toConstantValue(config);

        kernel.bind<ICommandFactory>(BINDINGS.COMMANDS_FACTORY).to(CommandFactory).inSingletonScope();

        kernel.bind<IInput>(BINDINGS.INPUT).to(Input);
        kernel.bind<IOutput>(BINDINGS.OUTPUT).to(Output);


        kernel.bind<IOptionsDefinition>(BINDINGS.OPTIONS_DEFINITION).to(OptionsDefinition);
        kernel.bind<IArgumentsDefinition>(BINDINGS.ARGUMENTS_DEFINITION).to(ArgumentsDefinition);
        kernel.bind<ICommandsDefinition>(BINDINGS.COMMANDS_DEFINITION).to(CommandsDefinition);


        kernel.bind<IOptionsDefinitionParser>(BINDINGS.OPTIONS_DEFINITION_PARSER).to(OptionsDefinitionParser);
        kernel.bind<IArgumentsDefinitionParser>(BINDINGS.ARGUMENTS_DEFINITION_PARSER).to(ArgumentsDefinitionParser);
        kernel.bind<ICommandsDefinitionParser>(BINDINGS.COMMANDS_DEFINITION_PARSER).to(CommandsDefinitionParser);


        kernel.bind<IParsedOptionsDefinition>(BINDINGS.PARSED_OPTIONS_DEFINITION).to(ParsedOptionsDefinition);
        kernel.bind<IParsedArgumentsDefinition>(BINDINGS.PARSED_ARGUMENTS_DEFINITION).to(ParsedArgumentsDefinition);
        kernel.bind<IParsedCommandsDefinition>(BINDINGS.PARSED_COMMANDS_DEFINITION).to(ParsedCommandsDefinition);

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
        // });
        this.bindParserFactory<IOptionsDefinitionParser>(BINDINGS.OPTIONS_DEFINITION_PARSER_FACTORY, BINDINGS.OPTIONS_DEFINITION_PARSER)
        this.bindParserFactory<IArgumentsDefinitionParser>(BINDINGS.ARGUMENTS_DEFINITION_PARSER_FACTORY, BINDINGS.ARGUMENTS_DEFINITION_PARSER)
        this.bindParserFactory<ICommandsDefinitionParser>(BINDINGS.COMMANDS_DEFINITION_PARSER_FACTORY, BINDINGS.COMMANDS_DEFINITION_PARSER)


    }

    private bindParserFactory<T2 extends IOptionsDefinitionParser>(binding, parserBinding){
        this.bind<Factory<T2>>(binding).toFactory<any>((context: Context) => {
            return (definition: any, argv: any[]) => {
                let parser        = context.kernel.get<T2>(parserBinding);
                parser.definition = definition;
                parser.argv       = argv;
                return parser;
            }
        });
    }

}

let app = new App;


export {app, App}

