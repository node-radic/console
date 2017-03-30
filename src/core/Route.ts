import { defined, kindOf } from "@radic/util";
import { Command, Group } from "./nodes";
import ParsedNode from "../parser/ParsedNode";
import Parser from "../parser/Parser";
import { Container } from "./ioc";
import Events from "./Events";
import {interfaces as i} from '../interfaces'

export default class Route {
    protected parser: Parser
    protected events: Events;
              isResolved: boolean = false;

    constructor(public argv: string[],
                public item?: i.NodeConfig | i.GroupConfig | i.CommandConfig) {

        this.events = Container.getInstance().make<Events>('console.events')
        this.parser = Container.getInstance().make<Parser>('console.parser')
        // this.registry     = Container.getInstance().make<Registry>('console.registry')

        // this.hasArguments = leftoverArguments.length > 1;
        this.isResolved = defined(item);

        // The remaining arguments did not match any of the children in the group.
        // This equals bad input when doing on a group, a group does not accept arguments
        // if ( this.isResolved && this.hasArguments && item.type === 'group' ) {
        //     this.hasInvalidArguments = true;
        // }

        this.events.emit('route:created', this)

    }

    execute() {
        if ( ! this.isResolved ) {
            throw new Error('Could not resolve input to anything. ')
        }
        this.events.emit('route:execute:' + this.item.type, this)
        return this.item.type === 'group' ? this.executeGroup() : this.executeCommand();
    }


    protected executeGroup() {
        let parsed = this.parser.parseGroup(this.argv, this.item);
        this.events.emit('route:execute:group:parsed', this)
        let group = parsed.getNodeInstance<Group>()
        this.events.emit('route:execute:group:created', this)

        if ( kindOf(group[ 'handle' ]) === 'function' ) {
            group[ 'handle' ].apply(group);
        }
        this.events.emit('route:execute:group:handled', this)
    }

    protected executeCommand() {
        let parsed: ParsedNode = this.parser.parseCommand(this.argv, this.item);
        this.events.emit('route:execute:command:parsed', this)
        let command = parsed.getNodeInstance<Command>()
        this.events.emit('route:execute:command:created', this)

        if ( kindOf(command[ 'handle' ]) === 'function' ) {
            command[ 'handle' ].apply(command);
        }
        this.events.emit('route:execute:command:handled', this)
    }
}