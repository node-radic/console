import { defined, kindOf } from "@radic/util";
import { Command, Group } from "./nodes";
import ParsedNode from "../parser/ParsedNode";
import Parser from "../parser/Parser";
import { Container } from "./ioc";
import Events from "./Events";
import { interfaces as i } from '../interfaces'
import { isNumber, escapeRegExp, isUndefined } from "lodash";
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

    execute() {
        if(this.isExecuted) return
        this.isExecuted = true
        if ( ! this.isResolved ) {
            Cli.error('Could not resolve input to anything. ')
        }
        this.events.emit('route:execute', this)
        if ( kindOf(this.node[ 'handle' ]) === 'function' ) {
            this.node[ 'handle' ].apply(this.node);
        }
    }

    get node(): T {
        return this.parsed.getNodeInstance<T>()
    }
}