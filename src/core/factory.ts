import { kindOf } from "@radic/util";
import { Container, inject, singleton } from "./ioc";
import { Events } from "./events";
import { Registry } from "./registry";
import Parser from "../parser/Parser";
import { Router } from "./router";
import { interfaces as i } from "../interfaces";
import ParsedNode from "../parser/ParsedNode";

@singleton('console.nodes.factory')
export class NodeFactory {

    constructor(@inject('console.registry') private registry: Registry,
                @inject('console.parser') private parser: Parser,
                @inject('console.router') private router: Router,
                @inject('console.events') private events: Events) {

    }



    protected executeGroup() {
        let parsed = this.parser.parseGroup(this.parsed.argv, this.item);
        let group  = this.makeNode(parsed);

        if ( kindOf(group[ 'handle' ]) === 'function' ) {
            group[ 'handle' ].apply(group);
        }
    }

    protected executeCommand() {
        let parsed: Parsed = this.parser.parseCommand(this.parsed.argv, this.item);
        let command        = this.makeNode(parsed);

        command[ 'arguments' ] = parsed.getArguments();
        if ( parsed.hasArguments ) {
            command[ 'arguments' ] = parsed.arguments;
            parsed.getArguments().getKeys().forEach(key => {
                // @todo: if command[key] is not undefined, let it behave like a defaultOverride / fallback
                // command[ key ] = parsed.arg(key, command[ key ])
                if ( command[ key ] === undefined ) {
                    command[ key ] = parsed.arg(key)
                }
            })
        }

        if ( kindOf(command[ 'handle' ]) === 'function' ) {
            command[ 'handle' ].apply(command);
        }
    }

    protected makeNode<T extends Node<any>>(parsed: Parsed): T {
        let node    = Container.getInstance().build<T>(this.item.cls);
        let setters = {
            name   : this.item.name,
            desc   : this.item.desc,
            options: parsed.getOptions(),
            config : this.item
        }
        parsed.getOptions().getKeys().forEach(key => {
            if ( setters[ key ] === undefined ) {
                setters[ key ] = parsed.opt(key)
            }
        })

        Object.keys(setters).forEach(key => {
            node[ key ] = setters[ key ]
        })

        return node;
    }
}