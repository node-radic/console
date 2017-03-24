import { Container } from "./ioc";
import { Registry } from "./registry";
import { interfaces } from "./interfaces";
import { isUndefined } from "util";
import * as _ from 'lodash';


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
     * @param arr
     */
    resolveFromArray(arr: string[]) {
        let tree  = this.getTree(),
            stop  = false,
            parts = [],
            resolvedChild,
            resolved;

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

        if ( resolvedChild ) {
            resolved = { tree, parts, args: arr, hasArguments: arr.length > 0 }
            return resolved
        }
        return null;
    }

    resolveFromString(resolvable: string) {
        return this.resolveFromArray(resolvable.split(' '))
    }

}

export interface ResolvedRoute<T extends interfaces.CliChildConfig> {
    tree?: interfaces.CliChildConfig[]
    parts?: string[]
    args?: string[]
    hasArguments?: boolean
    item?: T
}