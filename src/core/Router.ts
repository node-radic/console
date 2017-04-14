import { Container, inject, singleton } from "./ioc";
import Registry from "./Registry";
import { isUndefined } from "util";
import * as _ from 'lodash';
import { IConfigProperty,defined, kindOf } from "@radic/util";
import Parser from "../parser/Parser";
import { Group, Command, Node } from "./nodes";
import Events  from "./Events";
import ParsedNode from "../parser/ParsedNode";
import { interfaces as i } from "../interfaces";
import Route from "./Route";


@singleton('console.router')
export default class Router {

    constructor(@inject('console.config') protected config: IConfigPropertyy,
                @inject('console.registry') protected registry: Registry,
                @inject('console.events') protected events: Events) {
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
        this.events.emit('router:resolve', parsedRoot, this)
        let leftoverArguments: string[] = [].concat(parsedRoot.arguments);

        let items: i.NodeConfig[]    = this.items,
            stop: boolean            = false,
            spendArguments: string[] = [],
            parentCls: Function      =  this.registry.root.cls,
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

        const route = new Route(argv, resolved);
        this.events.emit('router:resolved', route, this)
        return route;
    }
}

