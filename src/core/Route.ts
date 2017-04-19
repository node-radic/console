import { defined, kindOf } from "@radic/util";
import ParsedNode from "../parser/ParsedNode";
import Parser from "../parser/Parser";
import { Container } from "./ioc";
import Events from "./Events";
import { interfaces as i } from "../interfaces";
import { Cli } from "./cli";


export default class Route<C extends i.NodeConfig, T extends i.Node<C>> {
    protected parser: Parser

    protected events: Events;
              isResolved: boolean = false;
              isExecuted: boolean = false;

    parsed: ParsedNode;

    constructor(public argv: string[],
                public item?: C) {

        this.events = Container.getInstance().make<Events>('console.events')
        this.parser = Container.getInstance().make<Parser>('console.parser')
        // this.registry     = Container.getInstance().make<Registry>('console.registry')

        // this.hasArguments = leftoverArguments.length > 1;
        this.isResolved = defined(item) && item !== null;

        // The remaining arguments did not match any of the children in the group.
        // This equals bad input when doing on a group, a group does not accept arguments
        // if ( this.isResolved && this.hasArguments && item.type === 'group' ) {
        //     this.hasInvalidArguments = true;
        // }

        this.events.emit('route:created', this)

        this.parsed = this.parser.parse(this.argv, this.item);

    }

    cancel() {
        this.isExecuted = true;
    }

    execute() {
        this.events.emit('route:execute', this) // emit event here before isExecuted to provide Route cancelation
        if ( this.isExecuted ) return
        this.isExecuted = true
        if ( ! this.isResolved ) {
            Cli.error('Could not resolve input to anything. ')
        }
        if ( kindOf(this.node[ 'handle' ]) === 'function' ) {
            this.node[ 'handle' ].apply(this.node);
        }
        this.events.emit('route:executed', this)
    }

    get node(): T {
        return this.parsed.getNodeInstance<T>()
    }
}