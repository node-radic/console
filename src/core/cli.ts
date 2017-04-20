import { Container, inject, ServiceIdentifier, singleton } from "./ioc";
import { IConfigProperty, inspect, kindOf } from "@radic/util";
import { ParsedNode, Parser } from "../parser";
import interfaces from "../interfaces";
import config from "../config";
import { Registry } from "./Registry";
import { Resolver } from "./Resolver";
import { Events } from "./Events";
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

    // public config: IConfigProperty

    protected parsedRootNode: ParsedNode;

    constructor(@inject('console.registry') private _registry: Registry,
                @inject('console.parser') private _parser: Parser,
                @inject('console.resolver') private _resolver: Resolver,
                @inject('console.events') private _events: Events,
                @inject('console.config') public config: IConfigProperty) {
        // this.config = config;
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

    /**
     * Parses the input using the options defined in the root node (group or command, depending on mode) and returns the result.
     * Without input, process.argv will be used.
     * ```
     * const parsedRootNode:ParsedNode = cli.parse();
     * ```
     * @param {string[]|string} argv
     * @returns {ParsedNode}
     */
    parse(argv?: string[] | string): ParsedNode {
        this.events.emit('parse', argv, this);
        if ( kindOf(argv) === 'string' ) argv = (<string> argv).split(' ')
        argv = <string[]> argv || process.argv.slice(2);

        this.parsedRootNode = this._registry.root.instance = this._parser.parse(argv, this._registry.root);

        this.events.emit('parsed', this.parsedRootNode);
        return this.parsedRootNode;
    }

    resolve<C extends any, T extends any>(): ParsedNode {

        this.events.emit('resolve', this.parsedRootNode);
        if ( this.config('mode') === 'command' ) {
            Cli.error('Cannot use the handle method when mode === command');
        }
        if ( ! this.parsedRootNode ) {
            Cli.error('Cannot resolve, need to parse first');
        }

        const resolverResult = this._resolver.resolve(this.parsedRootNode);
        this.events.emit('resolved', resolverResult);

        if ( resolverResult === null ) {
            Cli.error('Could not resolve input to anything. ')
        }

        const parsedNode = this._parser.parse(resolverResult.argv, resolverResult.node);
        this.events.emit('resolved:parsed', parsedNode)
        return parsedNode;
    }

    handle(parsedNode: ParsedNode):boolean {
        const nodeInstance = parsedNode.getNodeInstance();
        if ( kindOf(nodeInstance[ 'handle' ]) === 'function') {
            this.events.emit('handle', parsedNode)
            nodeInstance[ 'handle' ].apply(nodeInstance);
            this.events.emit('handled', parsedNode);
            return true;
        }
        return false;
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

    helpers(...names: string[]): this {
        names.forEach(name => this.helper(name));
        return this
    }

    get<T>(id: ServiceIdentifier): T {
        return Container.getInstance().get<T>(id);
    }
}