import { Container, inject, ServiceIdentifier, singleton } from "./ioc";
import Registry from "./Registry";
import { IConfigProperty, inspect, kindOf } from "@radic/util";
import { ParsedNode, Parser } from "../parser";
import interfaces from "../interfaces";
import config from "../config";
import Router from "./NodeResolver";
import Events from "./Events";
import Route from "./NodeResolverResult";
export type CliMode = 'groups' | 'command';

@singleton('console.cli')
export class Cli {

    static error(msg: string) {
        if ( config.get('prettyError', true) ) {
            // Cli.getInstance().out.error('An error occurred!').writeln(msg);
            process.exit(1);
        }
        throw new Error(msg);
    }

    public config: IConfigProperty

    protected parsedRootNode: ParsedNode;

    constructor(@inject('console.registry') private _registry: Registry,
                @inject('console.parser') private _parser: Parser,
                @inject('console.router') private _router: Router,
                @inject('console.events') private _events: Events) {
        this.config = config;
    }

    get mode(): CliMode {
        return this.config('mode');
    }

    get events(): Events {
        return this._events;
    }

    static getInstance(): Cli {
        return Container.getInstance().make<Cli>('console.cli');
    }

    parse(argv?: string[] | string): ParsedNode {
        this.events.emit('parse', argv, this);
        if ( kindOf(argv) === 'string' ) argv = (<string> argv).split(' ')
        argv = <string[]> argv || process.argv.slice(2);

        this.parsedRootNode = this._registry.root.instance  = this._parser.parse(argv, this._registry.root);

        if ( this.mode === 'groups' && this.config('autoExecute') ) {
            this.handle().execute();
        }

        this.events.emit('parsed', this.parsedRootNode, this);
        return this.parsedRootNode;
    }

    handle<C extends any, T extends any>(parsed?: ParsedNode): Route<C | any, T | any> {
        this.events.emit('handle', parsed, this);
        if ( this.config('mode') === 'command' ) {
            Cli.error('Cannot use the handle method when mode === command');
        }
        if ( ! this.parsedRootNode ) {
            Cli.error('Cannot handle, need to parse first');
        }
        const route = this._router.resolve(parsed || this.parsedRootNode);
        this.events.emit('handled', route, this);
        return route;
    }

    dump(target?: any) {
        inspect(target || this);
    }


    group(name: string, config: interfaces.GroupConfig = {}): interfaces.GroupConfig {
        if ( this.mode !== 'groups' ) {
            throw new Error('Cannot declare groups for the CLI when not using "groups" mode.');
        }
        config.name = name
        return this._registry.addGroup(config);
    }

    command(name: string, config: interfaces.CommandConfig): interfaces.CommandConfig {
        if ( this.mode !== 'groups' ) {
            throw new Error('Cannot declare commands for the CLI when not using "groups" mode.');
        }
        config.name = name;
        return this._registry.addCommand(config);
    }

    option(name: string, config: interfaces.RootOptionConfig = {}): this {
        let global = config.global = config.global || false;
        let key = (global === true && this.mode === "groups") ? 'globalOptions' : 'options';
        delete config.global;

        this._registry.root.options[ name ] = config;
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
            throw new Error('Cannot declare arguments for the CLI when not using command mode.');
        }
        this._registry.root.arguments[ name ] = config;
        return this;
    }

    arguments(config: { [name: string]: interfaces.ArgumentConfig }): this {
        if ( kindOf(config) !== 'array' ) {
            Object.keys(config).forEach(name => this.argument(name, config[ name ]));
        }
        return this;
    }

    helper(name: string, config?: interfaces.HelperOptionsConfig): this {
        this._registry.enableHelper(name, config)
        return this;
    }

    helpers(...names:string[]):this{
        names.forEach(name => this.helper(name));
        return this
    }

    get<T>(id: ServiceIdentifier): T {
        return Container.getInstance().get<T>(id);
    }
}