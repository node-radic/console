import { Container } from "./ioc";
import { Registry } from "./registry";
import { interfaces } from "./interfaces";
import { isUndefined } from "util";
import * as _ from 'lodash';
import { defined, kindOf } from "@radic/util";
import Parser from "./parser/Parser";
import Parsed from "./parser/Parsed";
import { Group, Command } from "./cli-children";
import { Events } from "./events";


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


    get items(): interfaces.CliChildConfig[] {
        return [].concat(this.registry.commands, this.registry.groups);
    }

    getTree() {
        return this.unflatten(this.items);
    }


    getNamedTree(array?: interfaces.CliChildConfig[], tree = {}) {
        if ( isUndefined(array) ) array = this.unflatten(this.items);
        array.forEach((item: interfaces.CommandConfig) => {
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
     * @param parsed
     */
    resolve(parsed: Parsed): Route | null {
        let arr: string[] = [].concat(parsed.arguments);

        let tree  = this.getTree(),
            stop  = false,
            parts = [],
            resolvedChild;

        while ( stop === false && arr.length > 0 ) {
            let part  = arr.shift();
            let found = _.find(tree, { name: part });
            if ( found ) {
                resolvedChild = <any> found;
                parts.push(part);
                tree = found[ 'children' ] || {}
            } else {
                stop = true;
                arr.unshift(part)
            }
        }

        return new Route(parsed, tree, parts, arr, resolvedChild);
    }
}

export class Route {
    protected parser: Parser
    protected events: Events;
    protected _root: interfaces.GroupConfig;

    isResolved: boolean          = false;
    hasArguments: boolean        = false;
    hasInvalidArguments: boolean = false;

    constructor(protected parsed: Parsed,
                public tree: interfaces.CliChildConfig[],
                public parts: string[],
                public args: string[],
                public item?: interfaces.CliChildConfig) {

        this.events = Container.getInstance().make<Events>('console.events')
        this.parser = Container.getInstance().make<Parser>('console.parser')
        // this.registry     = Container.getInstance().make<Registry>('console.registry')

        this.hasArguments = args.length > 1;
        this.isResolved   = defined(item);

        // The remaining arguments did not match any of the children in the group.
        // This equals bad input when doing on a group, a group does not accept arguments
        if ( this.isResolved && this.hasArguments && item.type === 'group' ) {
            this.hasInvalidArguments = true;
        }

        // filter out all non root options
        // and do something with globals
        const registry: Registry = Container.getInstance().make<Registry>('console.registry');
        this._root               = registry.getRoot<interfaces.GroupConfig>('groups');

        this.events.emit('route:created', this)

    }

    execute() {
        if ( ! this.isResolved ) {
            throw new Error('Could not resolve input to anything. ')
        }
        return this.item.type === 'group' ? this.executeGroup() : this.executeCommand();
    }

    protected executeGroup() {
        let group = this.makeChild();
        if ( kindOf(group[ 'handle' ]) === 'function' ) {
            group[ 'handle' ].apply(group);
        }
    }

    protected executeCommand() {
        let cfg           = <interfaces.CommandConfig> this.item;
        let command = this.makeChild({ arguments: cfg.arguments });
        if ( kindOf(command[ 'handle' ]) === 'function' ) {
            command[ 'handle' ].apply(command);
        }
    }

    protected makeChild<T extends interfaces.CliChild<any>>(setters: any = {}) : T {
        let parsed  = this.parser[ this.item.type ].apply(this.parser, [ this.parsed.original, this.item ]);
        let child   = Container.getInstance().build<T>(this.item.cls);
        setters = _.merge({
            name     : this.item.name,
            desc     : this.item.desc,
            options  : parsed.options,
            config   : this.item
        }, setters)
        Object.keys(setters).forEach(key => {
            child[ key ] = setters[ key ]
        })
        return child;
    }
}