import { inject, singleton } from "./ioc";
import { isUndefined } from "util";
import * as _ from "lodash";
import { IConfigProperty } from "@radic/util";
import { Registry } from "./Registry";
import { Events } from "./Events";
import { ParsedNode } from "../parser/ParsedNode";
import { NodeResolverResult } from "./NodeResolverResult";
import { interfaces as i } from "../interfaces";

/* rename to?
 NodeResolver:
 - Resolver
 - NodeResolver
 - NodeHierarchyResolver

 NodeResolverResult:
 - NodeResolution
 - Resolved
 - ResolvedNode
 -


 NodeResolver -> ResolvedNode
 */
@singleton('console.resolver')
export class NodeResolver {

    constructor(@inject('console.config') protected config: IConfigProperty,
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
    resolve(parsedRoot: ParsedNode): NodeResolverResult<any, any> | null {
        this.events.emit('router:resolve', parsedRoot, this)

        let leftoverArguments: string[] = [].concat(parsedRoot.arguments);

        let items: i.NodeConfig[]    = this.items,
            stop: boolean            = false,
            spendArguments: string[] = [],
            parentCls: Function      = this.registry.root.cls,
            resolved: i.NodeConfig   = null;

        // if no arguments, then its the root node
        if ( parsedRoot.arguments.length === 0 ) {
            stop     = true
            resolved = this.registry.root
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

        // If we have resolved to a node config (command or group), we need to prepare :
        // - the argv should be filtered, the spend arguments should be removed.
        // - the resolved node config's options should merge in global options. We leave all options in the argv.
        let argv = parsedRoot.argv;
        if ( resolved ) {
            argv = argv.filter((val) => spendArguments.indexOf(val) === - 1);
            // resolved.options = _.merge({}, this.registry.root.globalOptions, resolved.options);
        }

        const route = new NodeResolverResult(argv, resolved);
        this.events.emit('router:resolved', route, this)
        return route;
    }
}

