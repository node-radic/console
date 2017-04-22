import * as parser from "yargs-parser";
import { cloneDeep, merge } from "lodash";
import { defined, IConfigProperty, kindOf } from "@radic/util";
import { bindTo, inject } from "../core/Container";
import { interfaces as i } from "../interfaces";
import { ParsedNode } from "./ParsedNode";
import { Registry } from "../core/Registry";
import {ArgumentCollection ,OptionCollection }from "./InputCollections";
import { Cli } from "../core/Cli";

@bindTo('console.parser')
export class Parser {

    argumentTypeTransformers: { [name: string]: i.ArgumentTypeTransformer };

    constructor(@inject('console.config') protected config: IConfigProperty,
                @inject('console.registry') protected registry: Registry) {
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


    setArgumentTransformer(type: string, transformer: i.ArgumentTypeTransformer) {
        this.argumentTypeTransformers[ type ] = transformer;
    }

    parse(argv: string[], config: i.NodeConfig | i.GroupNodeConfig | i.CommandNodeConfig): ParsedNode<i.GroupNodeConfig | i.CommandNodeConfig> {
        return this.parseNode(argv, config)
    }


    protected parseNode(argv: string[], config: i.NodeConfig | i.GroupNodeConfig | i.CommandNodeConfig): ParsedNode<i.GroupNodeConfig | i.CommandNodeConfig> {
        let yargsOutput: i.ParserOutput     = parser.detailed(argv, this.transformOptions(config.options));
        let parsedOptions: OptionCollection = this.parseOptions(yargsOutput, config.options)
        let parsedArguments: ArgumentCollection;

        if ( config.type === 'command' ) {
            parsedArguments = this.parseArguments(yargsOutput, (<i.CommandNodeConfig> config).arguments);
        }

        return new ParsedNode(argv, yargsOutput, config, parsedOptions, parsedArguments);
    }

    protected parseOptions(yargsOutput: i.ParserOutput, optionsConfig: { [name: string]: i.OptionConfig }): OptionCollection {
        let argv = cloneDeep(yargsOutput.argv)
        delete argv[ '_' ];
        return new OptionCollection(argv, optionsConfig);
    }

    /** arguments are NOT parsed by yargs-parser, we'll have to do it ourself */
    protected parseArguments(yargsOutput: i.ParserOutput, argumentsConfig: { [name: string]: i.ArgumentConfig }): ArgumentCollection {
        let parsed: { [name: string]: any }         = {};
        let args                                    = yargsOutput.argv._;
        let defaultArgumentConfig: i.ArgumentConfig = {
            required: false,
            default : undefined
        }
        Object.keys(argumentsConfig).forEach((name: any, pos: number) => {
            let cfg: i.ArgumentConfig = merge({}, defaultArgumentConfig, argumentsConfig[ name ]);
            if ( cfg.required && cfg.default !== undefined ) {
                Cli.error(`Cannot define a default on required argument [${name}]`);
            }
            // Argument has no value: is required? has default? otherwise null it.
            if ( args[ pos ] === undefined ) {
                if ( cfg.default !== undefined ) return parsed[ name ] = cfg.default;

                if ( cfg.required ) Cli.error(`Argument ${pos} [${name}] is required`);

                if ( defined(cfg.type) && cfg.type === 'boolean' && this.config('parser.arguments.undefinedBooleanIsFalse', false) === true )
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

        return new ArgumentCollection(parsed, argumentsConfig);
    }


    /** transforms my option structure to the yargs-parser option structure */
    protected transformOptions(optionsConfig: { [name: string]: i.OptionConfig }): i.ParserOptionsConfig {
        let options: i.ParserOptionsConfig = {
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
            configuration: {
                'short-option-groups'      : true,
                'camel-case-expansion'     : true,
                'dot-notation'             : true,
                'parse-numbers'            : true,
                'boolean-negation'         : true,
                'duplicate-arguments-array': true,
                'flatten-duplicate-arrays' : true,
            }
        };
        Object.keys(optionsConfig).forEach(name => {
            let config = optionsConfig[ name ];
            let type   = config.type || 'boolean';

            options.alias[ name ] = [];

            if ( config.count ) {
                options.count[ name ] = config.count
                type                  = undefined
            }

            if ( config.alias ) {
                if ( kindOf(config.alias) === 'string' ) config.alias = [ <string> config.alias ];
                (<string[]> config.alias).forEach(alias => options.alias[ name ].push(alias));
            }

            if ( config.array === true ) options.array.push(name);
            if ( config.transformer ) options.coerce[ name ] = config.transformer;
            if ( config.arguments ) options.narg[ name ] = config.arguments;
            if ( config.default ) options.default[ name ] = config.default

            if ( type !== undefined ) {
                options[ type ].push(name);
                optionsConfig[ name ][ 'type' ] = type;
            }
        })
        return options;
    }

}


