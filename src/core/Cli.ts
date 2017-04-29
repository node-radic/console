import { Container, inject, ServiceIdentifier, singleton } from "./Container";
import { IConfigProperty, kindOf } from "@radic/util";
import { ParsedNode, Parser } from "../parser";
import { interfaces as i } from "../interfaces";
import config from "../config";
import { Resolver } from "./Resolver";
import { Event, Events, HaltEvent } from "./Events";
import { Repository } from "./Repository";
export type CliMode = 'groups' | 'command';


export class CliParseEvent extends HaltEvent {
    constructor(public argv: string[], public nodeConfig: i.NodeConfig) {
        super('cli:parse');
    }
}
export class CliParsedEvent extends Event {
    constructor(public parsedRootNode: ParsedNode<i.NodeConfig>) {
        super('cli:parsed');
    }
}


@singleton('console.cli')
export class Cli {

    protected parsedRootNode: ParsedNode<any>;

    constructor(@inject('console.repository') private _repository: Repository,
                @inject('console.parser') private _parser: Parser,
                @inject('console.resolver') private _resolver: Resolver,
                @inject('console.events') private _events: Events,
                @inject('console.config') public config: IConfigProperty) {
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

    static error(msg: string) {
        if ( config.get('prettyError', true) ) {
            // Cli.getInstance().out.error('An error occurred!').writeln(msg);
            process.exit(1);
        }
        throw new Error(msg);
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
    parse(argv?: string[] | string): ParsedNode<i.NodeConfig> {
        if ( kindOf(argv) === 'string' ) argv = (<string> argv).split(' ')
        argv = <string[]> argv || process.argv.slice(2);

        if ( this.events.fire(new CliParseEvent(argv, this._repository.root)).halt ) return;

        let parsedRootNode = this._parser.parse(argv, this._repository.root);

        return this.parsedRootNode =
            this._repository.root.instance =
                this.events.fire(new CliParsedEvent(parsedRootNode)).parsedRootNode;
    }

    resolve(): ParsedNode<i.GroupNodeConfig | i.CommandNodeConfig> | boolean {
        this.events.emit('cli:resolve', this.parsedRootNode);

        if ( this.mode === 'command' ) {
            Cli.error('Cannot use the handle method when mode === command');
        }
        if ( ! this.parsedRootNode ) {
            Cli.error('Cannot resolve, need to parse first');
        }

        // no arguments? no use to resolve another parsed node. Return the parsed root node so it'll be used when calling handle.
        if ( this.parsedRootNode.argv.length === 0 ) {
            this.events.emit('cli:resolve:root', this.parsedRootNode)
            return this.parsedRootNode;
        }

        const resolverResult = this._resolver.resolve(this.parsedRootNode);

        if ( resolverResult === null ) {
            this.events.emit('cli:resolve:nothing', this.parsedRootNode)
            return false;
        }
        this.events.emit('cli:resolve:found', resolverResult);

        const parsedNode = this._parser.parse(resolverResult.argv, resolverResult.node);
        this.events.emit('cli:resolve:parsed', parsedNode)
        return parsedNode;
    }

    handle(parsedNode: ParsedNode<i.GroupNodeConfig | i.CommandNodeConfig> | boolean): boolean {
        if ( ! parsedNode ) parsedNode = this.parsedRootNode;
        const nodeInstance = (<ParsedNode<i.GroupNodeConfig | i.CommandNodeConfig>> parsedNode).getNodeInstance();
        if ( kindOf(nodeInstance[ 'handle' ]) === 'function' ) {
            this.events.emit('cli:handle', parsedNode)
            nodeInstance[ 'handle' ].apply(nodeInstance);
            this.events.emit('cli:handled', parsedNode);
            return true;
        }
        return false;
    }

    group(name: string, config: i.GroupNodeConfig = {}): i.GroupNodeConfig {
        if ( this.mode !== 'groups' ) {
            throw new Error('Cannot declare groups for the CLI when not using "groups" mode.');
        }
        config.name = name
        config.type = 'group';
        return this._repository.addNode(config);
    }

    command(name: string, config: i.CommandNodeConfig): i.CommandNodeConfig {
        if ( this.mode !== 'groups' ) {
            throw new Error('Cannot declare commands for the CLI when not using "groups" mode.');
        }
        config.name = name;
        config.type = 'command';

        return this._repository.addNode(config);
    }

    option(key: string, config: i.OptionConfig = {}): this {
        let type;
        if ( config.type === undefined ) type = Boolean;
        else if ( config.type === 'boolean' ) type = Boolean;
        else if ( config.type === 'string' ) type = String;
        else if ( config.type === 'number' ) type = Number;

        this._repository.addOption(); // @todo
        return this;
    }

    options(options: { [name: string]: i.OptionConfig }): this {
        if ( kindOf(options) !== 'array' ) {
            Object.keys(options).forEach(name => this.option(name, options[ name ]));
        }
        return this;
    }

    argument(name, config: i.ArgumentConfig = {}): this {
        if ( this.config('mode') !== 'command' ) {
            throw new Error('Cannot declare arguments for the CLI when not using command mode.');
        }

        this._repository.root.arguments[ name ] = config;
        return this;
    }

    arguments(config: { [name: string]: i.ArgumentConfig }): this {
        if ( kindOf(config) !== 'array' ) {
            Object.keys(config).forEach(name => this.argument(name, config[ name ]));
        }
        return this;
    }

    helper(name: string, config?: i.HelperOptionsConfig): this {
        this._repository.enableHelper(name, config)
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