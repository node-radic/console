import { merge } from 'lodash'
import { Container } from "./ioc";
import { Registry } from "./registry";
import { inspect, kindOf, Config, IConfigProperty } from "@radic/util";
import { Parser, Parsed } from "./parser";
import interfaces from './interfaces'
import config from "./config";
import { Router, Route } from "./router";
import { Events } from "./events";
export type CliMode = 'groups' | 'command';

@Container.singleton('console.cli')
export class Cli {
    public argv: string[]
    public parsed: Parsed
    public config: IConfigProperty
    public route: Route

    constructor(@Container.inject('console.registry') private _registry: Registry,
                @Container.inject('console.parser') private _parser: Parser,
                @Container.inject('console.router') private _router: Router,
                @Container.inject('console.events') private _events: Events) {
        this.config = config;
    }

    get events(): Events {
        return this._events;
    }

    static getInstance(): Cli {
        return <Cli> Container.getInstance().make<Cli>('console.cli');
    }

    parse(argv?: string[]): Parsed {
        this.argv = argv || process.argv.slice(2);
        this.events.emit(['parse:before', 'parse:before:' + this.config('mode')], this.argv);
        if ( this.config('mode') === "command" ) {
            this.parsed = this._parser.command(this.argv, this._registry.getRoot('command'));
        } else {
            this.parsed = this._parser.group(this.argv, this._registry.getRoot('groups'));
        }
        this.events.emit(['parse:after', 'parse:after:' + this.config('mode')], this.parsed);
        return this.parsed;
    }

    handle(): Route {
        if ( this.config('mode') === 'command' ) {
            throw new Error('Cannot use the handle method when mode === command');
        }
        if ( ! this.parsed ) {
            throw new Error('Cannot handle, need to parse first');
        }
        const r = this.route = this._router.resolve(this.parsed);
        return this.route;
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
        let global = config.global = config.global || false;
        let key = (global === true && this.config('mode') === "group") ? 'globalOptions' : 'options';
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