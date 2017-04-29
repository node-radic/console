import { inject, singleton } from "./Container";
import { isUndefined } from "util";
import * as _ from "lodash";
import { IConfigProperty } from "@radic/util";
import { Events } from "./Events";
import { ParsedNode } from "../parser/ParsedNode";
import { interfaces as i } from "../interfaces";
import { Repository } from "./Repository";


@singleton('console.resolver')
export class Resolver {
    constructor(@inject('console.config') protected config: IConfigProperty,
                @inject('console.repository') protected repository: Repository,
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
        return this.repository.nodes
    }

    getTree() {
        return this.unflatten(this.items);
    }


    getNamedTree(array?: i.NodeConfig[], tree = {}) {
        if ( isUndefined(array) ) array = this.unflatten(this.items);
        array.forEach((item: i.CommandNodeConfig) => {
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
    resolve(parsedRoot: ParsedNode<i.NodeConfig>): { argv: string[], node: i.NodeConfig } | null {
        this.events.emit('router:resolve', parsedRoot, this)

        let leftoverArguments: string[] = [].concat(parsedRoot.argv);

        let items: i.NodeConfig[]    = this.items,
            stop: boolean            = false,
            spendArguments: string[] = [],
            parentCls: Function      = this.repository.root.cls,
            resolved: i.NodeConfig   = null;

        // if no arguments, then its the root node
        if ( parsedRoot.argv.length === 0 ) {
            stop     = true
            resolved = this.repository.root
        }

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

        if ( ! resolved ) return null

        return {
            argv: parsedRoot.argv.filter((val) => spendArguments.indexOf(val) === - 1),
            node: resolved
        };
    }

    childrenOf(group: ParsedNode<i.GroupNodeConfig>): i.NodeConfig[] {
        return _.filter(this.items, { group: group.config.group })
    }
}

