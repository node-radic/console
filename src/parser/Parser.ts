import * as parser from 'yargs-parser'
import { merge, cloneDeep } from 'lodash'
import { defined, kindOf } from '@radic/util'
import { Container } from "../core/ioc";
import { interfaces as i } from "../interfaces";
import ParsedNode from "./ParsedNode";
import ParsedOptions from "./Options";
import ParsedArguments from "./Arguments";
import { config } from "../config";
import { Router } from "../core/router";
import { NodeType } from "../core/nodes";

@Container.bindTo('console.parser')
export default class Parser {

    argumentTypeTransformers: { [name: string]: i.ArgumentTypeTransformer };

    constructor(@Container.inject('console.router') protected router: Router) {
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

    parseGroup(argv: string[], config: i.GroupConfig): ParsedNode {
        return this.parseNode(argv, config);
    }

    parseCommand(argv: string[], config: i.CommandConfig): ParsedNode {
        return this.parseNode(argv, config);
    }

    setArgumentTransformer(type: string, transformer: i.ArgumentTypeTransformer) {
        this.argumentTypeTransformers[ type ] = transformer;
    }

    protected parseNode(argv: string[], config: i.NodeConfig | i.GroupConfig | i.CommandConfig): ParsedNode {
        let yargsOutput: i.YargsOutput   = parser.detailed(argv, this.transformOptions(config.options));
        let parsedOptions: ParsedOptions = this.parseOptions(yargsOutput, config.options)
        let parsedArguments: ParsedArguments;

        if ( config.type === 'command' ) {
            parsedArguments = this.parseArguments(yargsOutput, (<i.CommandConfig> config).arguments);
        }

        return new ParsedNode(argv, yargsOutput, config, parsedOptions, parsedArguments);
    }

    protected parseOptions(yargsOutput: i.YargsOutput, optionsConfig: { [name: string]: i.OptionConfig }): ParsedOptions {
        let argv = cloneDeep(yargsOutput.argv)
        delete argv[ '_' ];
        return new ParsedOptions(argv, optionsConfig);
    }

    /** arguments are NOT parsed by yargs-parser, we'll have to do it ourself */
    protected parseArguments(yargsOutput: i.YargsOutput, argumentsConfig: { [name: string]: i.ArgumentConfig }): ParsedArguments {
        let parsed: { [name: string]: any }         = {};
        let args                                    = yargsOutput.argv._;
        let defaultArgumentConfig: i.ArgumentConfig = {
            required: false,
            default : undefined
        }
        Object.keys(argumentsConfig).forEach((name: any, pos: number) => {
            let cfg: i.ArgumentConfig = merge({}, defaultArgumentConfig, argumentsConfig[ name ]);
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
    protected transformOptions(optionsConfig: { [name: string]: i.OptionConfig }): i.YargsOptionsConfig {
        let options: i.YargsOptionsConfig = {
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

            if(type !== undefined)
                options[ type ].push(name);
        })
        return options;
    }

}


