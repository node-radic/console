import { Container } from "./ioc";
import { Registry } from "./registry";
import { isUndefined } from "util";
import * as _ from 'lodash';
import { defined, kindOf } from "@radic/util";
import Parser from "../parser/Parser";
import { Group, Command, Node } from "./nodes";
import { Events } from "./events";
import ParsedNode from "../parser/ParsedNode";
import { interfaces as i } from "../interfaces";


@Container.singleton('console.router')
export class Router {

    constructor(@Container.inject('console.registry') protected registry: Registry) {
    }

    static create(registry: Registry): Router {
        return new Router(registry);
    }

    protected unflatten(array, parent: any = { cls: null }, tree: any[] = []) {
        var children = _.filter(array, (child: any) => {
            return child.group === parent.cls;
        });

        if ( ! _.isEmpty(children) ) {
            if ( parent.cls === null ) {
                tree = children;
            } else {
                parent[ 'children' ] = children;
            }
            _.each(children, (child) => { this.unflatten(array, child) });
        }

        return tree;
    }


    get items(): i.NodeConfig[] {
        return [].concat(this.registry.commands, this.registry.groups);
    }

    getTree() {
        return this.unflatten(this.items);
    }


    getNamedTree(array?: i.NodeConfig[], tree = {}) {
        if ( isUndefined(array) ) array = this.unflatten(this.items);
        array.forEach((item: i.CommandConfig) => {
            if ( item.type === "group" ) {
                tree[ item.name ] = {};
                this.getNamedTree(item[ 'children' ], tree[ item.name ])
            } else {
                tree[ item.name ] = item
            }
        })
        return tree;
    }

    /**
     * Resolves command or group from an array of arguments (useful for parsing the argv._ array)
     * @param parsedRoot
     */
    resolve(parsedRoot: ParsedNode): Route | null {
        let leftoverArguments: string[] = [].concat(parsedRoot.arguments);

        let items: i.NodeConfig[]    = this.items,
            stop: boolean            = false,
            spendArguments: string[] = [],
            parentCls: Function      = null,
            resolved: i.NodeConfig   = null;

        while ( stop === false && leftoverArguments.length > 0 ) {
            let part                = leftoverArguments.shift();
            let found: i.NodeConfig = _.find(items, { name: part, group: parentCls });
            if ( found ) {
                resolved  = found;
                parentCls = resolved.cls
                spendArguments.push(part);
            } else {
                stop = true;
                leftoverArguments.unshift(part)
            }
        }


        // If we have resolved to a node config (command or group), we need to prepare :
        // - the argv should be filtered, the spend arguments should be removed.
        // - the resolved node config's options should merge in global options. We leave all options in the argv.
        let argv = parsedRoot.argv;
        if ( resolved ) {
            argv             = argv.filter((val) => spendArguments.indexOf(val) === - 1);
            resolved.options = _.merge({}, this.registry.getRoot<i.GroupConfig>('groups').globalOptions, resolved.options);

        }

        return new Route(argv, resolved);
    }
}

export class Route {
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