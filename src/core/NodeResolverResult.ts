import { defined, kindOf } from "@radic/util";
import { ParsedNode } from "../parser/ParsedNode";
import { Parser } from "../parser/Parser";
import { Events } from "./Events";
import { Container } from "./ioc";
import { interfaces as i } from "../interfaces";
import { Cli } from "./cli";


export class NodeResolverResult<C extends i.NodeConfig, T extends i.Node<C>> {
    protected parser: Parser

    protected events: Events;
              isResolved: boolean = false;
              isExecuted: boolean = false;

    parsedNode: ParsedNode;

    constructor(public argv: string[],
                public item?: C) {

        this.events     = Container.getInstance().make<Events>('console.events')
        this.parser     = Container.getInstance().make<Parser>('console.parser')
        this.isResolved = defined(item) && item !== null;
        this.events.emit('route:created', this)
        if ( this.isResolved ) {
            this.parsedNode = this.parser.parse(argv, item);
        }

    }

    cancel() {
        this.isExecuted = true;
    }

    execute() {
        this.events.emit('route:execute', this) // emit event here before isExecuted to provide NodeResolverResult cancelation
        if ( this.isExecuted ) return
        if ( ! this.isResolved ) {
            Cli.error('Could not resolve input to anything. ')
        }
        if ( kindOf(this.parsedNodeInstance[ 'handle' ]) === 'function' ) {
            this.events.emit('route:execute:handle', this)
            if ( this.isExecuted ) return
            this.parsedNodeInstance[ 'handle' ].apply(this.parsedNodeInstance);
        }
        this.isExecuted = true
        this.events.emit('route:executed', this)
    }

    get parsedNodeInstance(): T {
        return this.parsedNode.getNodeInstance<T>()
    }
}