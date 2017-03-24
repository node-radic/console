import { merge } from 'lodash'
import { Container } from "./ioc";
import { Registry } from "./registry";
import { inspect, kindOf, Config, IConfigProperty } from "@radic/util";
import { Parser, Parsed } from "./parser";
import interfaces from './interfaces'
import config from "./config";
import { Router } from "./router";
export type CliMode = 'groups' | 'command';

@Container.singleton('console.cli')
export class Cli {
    private _registry: Registry;
    private _config: Config;
    private _parser: Parser;
            argv: string[]
            parsed: Parsed
            config: IConfigProperty

    constructor(@Container.inject('console.registry') registry: Registry,
                @Container.inject('console.parser') parser: Parser,
                @Container.inject('console.router') router: Router) {
        this._registry = registry;
        this._parser   = parser;
        this.config    = config;
    }

    static getInstance(): Cli {
        return <Cli> Container.getInstance().make<Cli>('console.cli');
    }

    parse(argv?: string[]) {
        this.argv = argv || process.argv.slice(2);
        if ( this.config('mode') === "command" ) {
            this.parsed = this._parser.command(this.argv, this._registry.getRoot('command'));
            return this.parsed;
        } else if ( this.config('mode') === 'groups' ) {
            this.parsed = this._parser.group(this.argv, this._registry.getRoot('groups'));
            let resolved = this._parser.resolve(this.argv);
            if(resolved){

            }
        }
    }

    dump(target?: any) {
        inspect(target || this);
    }


    group(name: string, config: interfaces.GroupConfig = {}): interfaces.GroupConfig {
        config.name = name
        return this._registry.addGroup(config);
    }

    command(name: string, config: interfaces.CommandConfig): interfaces.CommandConfig {
        config.name = name;
        return this._registry.addCommand(config);
    }

    option(name: string, config: interfaces.RootOptionConfig = {}): this {
        let global = config.global = config.global || false,
            key = global && this.config('mode') === "group" ? 'globalOptions' : 'options';
        delete config.global;
        this._registry.getRoot(this.config('mode'))[ key ][ name ] = config;
        return this;
    }

    options(options: { [name: string]: interfaces.RootOptionConfig }): this {
        if ( kindOf(options) !== 'array' ) {
            Object.keys(options).forEach(name => this.option(name, options[ name ]));
        }
        return this;
    }

    argument(name, config: interfaces.ArgumentConfig = {}): this {
        if ( this.config('mode') !== 'command' ) {
            throw new Error('Cannot declare arguments for the CLI when using group mode. Use command mode instead');
        }
        this._registry.getRoot<interfaces.CommandConfig>("command").arguments[ name ] = config;
        return this;

    }

    arguments(config: { [name: string]: interfaces.ArgumentConfig }): this {
        if ( kindOf(config) !== 'array' ) {
            Object.keys(config).forEach(name => this.argument(name, config[ name ]));
        }
        return this;

    }
}