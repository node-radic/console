import { interfaces } from "./interfaces";
import Registry from "./core/Registry";
import { Container } from "./core/ioc";
import { kindOf } from "@radic/util";
import { merge } from 'lodash'
import { CliMode } from "./core/cli";
import { NodeType } from "./core/nodes";

function makeOptions<T extends interfaces.NodeConfig>(cls: any, args: any[]): T {
    let len        = args.length;
    let options: T = <T> {};

    if ( len === 1 ) {
        if ( kindOf(args[ 0 ]) === 'string' ) {
            options.name = args[ 0 ]
        } else {
            merge(options, args[ 0 ]);
        }
    }
    if ( len === 2 ) {
        options.name = args[ 0 ];
        merge(options, args[ 1 ]);
    }

    options.cls = cls;

    return options
}


function command(name: string): ClassDecorator;
function command(options: interfaces.CommandConfig): ClassDecorator;
function command(name: string, options: interfaces.CommandConfig): ClassDecorator;
function command(...args: any[]): ClassDecorator {
    return (cls) => {

        Container.getInstance()
            .make<Registry>('console.registry')
            .addCommand(makeOptions<interfaces.CommandConfig>(cls, args))
    }
}


/**
 *
 * Decorator for groups
 *
 * ```
 * \@Container.group('git', <GroupConfig> {
     *      desc: 'Git operations',
     *      //...
     * })
 * export class GitGroup {
     *      //...
     * }
 * ```
 * @decorator
 *
 */
function group(name: string): ClassDecorator;
function group(options: interfaces.GroupConfig): ClassDecorator;
function group(name: string, options: interfaces.GroupConfig): ClassDecorator;
function group(...args: any[]): ClassDecorator {
    return (cls) => {
        Container.getInstance()
            .make<Registry>('console.registry')
            .addGroup(makeOptions<interfaces.GroupConfig>(cls, args))
    }
}

function root(config: interfaces.RootConfig): ClassDecorator {
    return (cls) => {
        config.cls = cls;
        Container.getInstance()
            .make<Registry>('console.registry')
            .setRoot(config);
    }
}

function helper(name: string): ClassDecorator;
function helper(options: interfaces.HelperOptions): ClassDecorator;
function helper(name: string, options: interfaces.HelperOptions): ClassDecorator;
function helper(...args: any[]): ClassDecorator {
    return (cls) => {
        Container.getInstance()
            .make<Registry>('console.registry')
            .addHelper(makeOptions(cls, args));
    }
}

export {command, group, root, helper }