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
            if ( parent.cls !== null ) {
            //     tree = children;
            // } else {
                parent[ 'children' ] = children;
            }
            _.each(children, (child) => { this.unflatten(array, child) });
        }

        return parent;
    }


    protected get nodes(): i.NodeConfig[] {
        return this.repository.nodes
    }

    getTree() {
        return this.unflatten(this.nodes, this.repository.root);
    }


    getNamedTree(array?: i.NodeConfig[], tree = {}) {
        if ( isUndefined(array) ) array = this.unflatten(this.nodes);
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
    resolve(parsedRoot: ParsedNode<i.NodeConfig>): { argv: string[], node: i.NodeConfig, parents: i.NodeConfig[] } | null {
        this.events.emit('router:resolve', parsedRoot, this)

        let nodes: i.NodeConfig[]       = this.nodes,

            leftoverArguments: string[] = [].concat(parsedRoot.argv),
            spendArguments: string[]    = [],
            parentChain: i.NodeConfig[] = [],

            parentCls: Function         = this.repository.root.cls,
            resolved: i.NodeConfig      = null,
            stop: boolean               = false;

        // if no arguments, then its the root node
        if ( parsedRoot.argv.length === 0 ) {
            stop     = true
            resolved = this.repository.root
        }

        while ( stop === false && leftoverArguments.length > 0 ) {
            let arg                 = leftoverArguments.shift();
            let found: i.NodeConfig = _.find(nodes, { name: arg, group: parentCls });
            if ( found ) {
                resolved  = found;
                parentCls = resolved.cls
                spendArguments.push(arg);
                parentChain.push(found)
            } else {
                stop = true;
                leftoverArguments.unshift(arg)
            }
        }

        if ( ! resolved ) return null

        return {
            argv   : parsedRoot.argv.filter((val) => spendArguments.indexOf(val) === - 1),
            node   : resolved,
            parents: parentChain
        };
    }

    childrenOf(group: ParsedNode<i.GroupNodeConfig>): i.NodeConfig[] {
        return _.filter(this.nodes, { group: group.config.group })
    }

    parentsOf(node: i.NodeConfig, parents: i.NodeConfig[] = []): i.NodeConfig[] {
        let stop = false,
            cls  = node.group;

        while ( cls ) {
            let parent = _.find(this.nodes, { cls: cls });
            if ( parent ) {
                parents.push(parent);
                cls = parent.group
            } else {
                cls = null
            }
        }
        return parents;
    }
}

