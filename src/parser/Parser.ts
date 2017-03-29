import * as parser from 'yargs-parser'
import { merge } from 'lodash'
import { defined, kindOf } from '@radic/util'
import { Container } from "../core/ioc";
import { interfaces } from "../interfaces";
import Parsed from "./Parsed";
import ParsedOptions from "./ParsedOptions";
import ParsedArguments from "./ParsedArguments";
import { config } from "../config";
import YargsOutput = interfaces.YargsOutput;
import { Router } from "../core/router";

@Container.bindTo('console.parser')
export default class Parser {

    argumentTypeTransformers: { [name: string]: interfaces.ArgumentTypeTransformer };

    constructor(@Container.inject('console.router') protected router:Router) {
        this.argumentTypeTransformers = {
            boolean(val: any): boolean {
                return val === 'true' || val === true || val === '1';
            },
            number(val: any): number {
                return parseInt(val);
            },
            string(val: any): string {
                return typeof val.toString === 'function' ? val.toString() : val;
            }
        }
    }

    group(argv: string[], config: interfaces.GroupConfig): Parsed {
        return this.parse(argv, config.options);
    }

    command(argv: string[], config: interfaces.CommandConfig): Parsed {
        return this.parse(argv, config.options, config.arguments);
    }

    setArgumentTransformer(type: string, transformer: interfaces.ArgumentTypeTransformer) {
        this.argumentTypeTransformers[ type ] = transformer;
    }

    protected parse(argv: string[], optionsConfig: { [name: string]: interfaces.OptionConfig }, argumentsConfig?: { [name: string]: interfaces.ArgumentConfig }): Parsed {
        let yargsOptionsConfig: interfaces.YargsOptionsConfig = this.transformOptions(optionsConfig);
        let yargsOutput: interfaces.YargsOutput               = parser.detailed(argv, yargsOptionsConfig);
        let parsedOptions: ParsedOptions                      = new ParsedOptions(yargsOutput.argv, optionsConfig);
        let parsedArguments: ParsedArguments;

        if ( argumentsConfig !== undefined ) {
            parsedArguments = this.parseArguments(yargsOutput, argumentsConfig);
        }

        return new Parsed(argv, yargsOutput, parsedOptions, parsedArguments);
    }

    /** arguments are NOT parsed by yargs-parser, we'll have to do it ourself */
    protected parseArguments(yargsOutput: interfaces.YargsOutput, argumentsConfig: { [name: string]: interfaces.ArgumentConfig }): ParsedArguments {
        let parsed: { [name: string]: any }                  = {};
        let args                                             = yargsOutput.argv._;
        let defaultArgumentConfig: interfaces.ArgumentConfig = {
            required: false,
            default : undefined
        }
        Object.keys(argumentsConfig).forEach((name: any, pos: number) => {
            let cfg: interfaces.ArgumentConfig = merge({}, defaultArgumentConfig, argumentsConfig[ name ]);
            if ( cfg.required && cfg.default !== undefined ) {
                yargsOutput.error = new Error(`Cannot define a default on required argument [${name}]`);
            }
            // Argument has no value: is required? has default? otherwise null it.
            if ( args[ pos ] === undefined ) {
                if ( cfg.default !== undefined ) return parsed[ name ] = cfg.default;

                if ( cfg.required ) throw new Error(`Argument ${pos} [${name}] is required`);

                if ( defined(cfg.type) && cfg.type === 'boolean' && config('parser.arguments.undefinedBooleanIsFalse', false) === true )
                    return parsed[ name ] = null;
            }

            // When argument type has NOT been given, but HAS a default
            // We try to 'resolve' the type transformer by checking the type of the default
            // If that exists. We put the type on the config so it'll be transformed a bit further on
            if ( false === defined(cfg.type) && defined(cfg.default) ) {
                if ( defined(this.argumentTypeTransformers[ kindOf(cfg.default) ]) ) {
                    cfg.type = kindOf(cfg.default);
                }
            }

            // Transform the argument to it's actual type
            if ( defined(cfg.type) && defined(this.argumentTypeTransformers[ cfg.type ]) ) {
                return parsed[ name ] = this.argumentTypeTransformers[ cfg.type ].apply(this, [ args[ pos ] ]);
            }

            parsed[ name ] = args[ pos ];
        })

        return new ParsedArguments(parsed, argumentsConfig);

    }


    /** transforms my option structure to the yargs-parser option structure */
    protected transformOptions(optionsConfig: { [name: string]: interfaces.OptionConfig }): interfaces.YargsOptionsConfig {
        let options: interfaces.YargsOptionsConfig = {
            alias        : {},
            array        : [],
            boolean      : [],
            string       : [],
            number       : [],
            // config?: boolean
            coerce       : {},
            count        : {},
            default      : {},
            narg         : {},
            normalize    : true,
            configuration: {}
        };
        Object.keys(optionsConfig).forEach(name => {
            let config = optionsConfig[ name ];
            options[ config.type || 'boolean' ].push(name);
            options.alias[ name ] = [];
            if ( config.alias ) options.alias[ name ].push(config.alias);
            if ( config.array ) options.array.push(name);
            if ( config.transformer ) options.coerce[ name ] = config.transformer;
            if ( config.arguments ) options.narg[ name ] = config.arguments;
            if ( config.default ) options.default[ name ] = config.default
            if ( config.count ) options.count[ name ] = config.count
        })
        return options;
    }

}


