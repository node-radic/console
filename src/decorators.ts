import { interfaces as i } from "./interfaces";
import { Container } from "./core/Container";
import { kindOf } from "@radic/util";
import { merge } from "lodash";
import { OptionType } from "./core/nodes";
import { meta } from "./utils";
import { Repository } from "./core/Repository";


function makeNodeConfig<T extends i.NodeConfig>(cls: any, args: any[]): T {
    let len       = args.length
    let argt      = args.map(arg => kindOf(arg));
    let config: T = <any> { cls };
    if ( len > 0 && argt[ 0 ] === 'string' ) config.name = args[ 0 ];
    if ( len > 1 && argt[ 1 ] === 'string' ) config.desc = args[ 1 ];
    if ( len > 2 && argt[ 2 ] === 'function' ) config.group = args[ 2 ];

    // config is ALWAYS last parameter, so we can do it like this
    if ( len > 0 && argt[ len - 1 ] === 'object' ) merge(config, args[ len - 1 ]);
    return config;
}

let decorateAsGlobal = false;

declare type RootDecorator = <TFunction extends Function>(target: TFunction) => TFunction | void;
const repo = (): Repository => Container.getInstance().make<Repository>('console.repository');


/**
 * @decorator
 * @export
 */
function root(): ClassDecorator {
    return (cls: Function) => {
        if ( meta(cls).has('config') ) {
            repo().setRoot(cls);
        }
    }
}

/**
 * @decorator
 * @export
 */
function global(): PropertyDecorator {
    decorateAsGlobal = true;
    return (target: Object, key: string | symbol) => {
        decorateAsGlobal = false;
    }
}


function command(options: i.CommandNodeConfig): ClassDecorator
function command(name: string, options?: i.CommandNodeConfig): ClassDecorator
function command(name: string, desc: string, options?: i.CommandNodeConfig): ClassDecorator
function command(name: string, desc: string, group: any, options?: i.CommandNodeConfig): ClassDecorator
/**
 * @decorator
 * @export
 */
function command(...args: any[]): ClassDecorator {
    return (cls: Function) => {
        let config       = makeNodeConfig(cls, args);
        config[ 'type' ] = 'command';
        meta(cls).set('config', config);
        repo().addNode(cls);
    }
}

/**
 * @decorator
 * @export
 */
function group(): ClassDecorator
function group(options: i.GroupNodeConfig): ClassDecorator
function group(name: string, options?: i.GroupNodeConfig): ClassDecorator
function group(name: string, desc: string, options?: i.GroupNodeConfig): ClassDecorator
function group(name: string, desc: string, group: any, options?: i.GroupNodeConfig): ClassDecorator
function group(...args: any[]): ClassDecorator {
    return (cls: Function) => {
        let config       = makeNodeConfig(cls, args);
        config[ 'type' ] = 'group';
        meta(cls).set('config', config);
        repo().addNode(cls);
    }
}

/**
 * @decorator
 * @export
 */
function helper(name: string): ClassDecorator;
function helper(options: i.HelperOptions): ClassDecorator;
function helper(name: string, options: i.HelperOptions): ClassDecorator;
function helper(...args: any[]): ClassDecorator {
    return (cls) => {
        repo().addHelper(makeNodeConfig(cls, args));
    }
}

/**
 * @decorator
 * @export
 */
function option(config?: i.OptionConfig): PropertyDecorator
function option(desc: string, config?: i.OptionConfig): PropertyDecorator
function option(desc: string, alias: string | string[], config?: i.OptionConfig): PropertyDecorator
function option(desc: string, type: Function, config?: i.OptionConfig): PropertyDecorator
function option(desc: string, type: Function, alias: string | string[], config?: i.OptionConfig): PropertyDecorator
function option(...args: any[]): PropertyDecorator {
    let len                    = args.length
    let config: i.OptionConfig = {
        global: decorateAsGlobal
    };
    let argt                   = args.map(arg => kindOf(arg));
    let type: Function;

    if ( len > 0 && argt[ 0 ] === 'string' ) config.desc = args[ 0 ];
    if ( len > 1 && (argt[ 1 ] === 'string' || argt[ 1 ] === 'array') ) config.alias = args[ 1 ];
    if ( len > 1 && argt[ 1 ] === 'function' ) type = args[ 1 ];
    if ( len > 2 && (argt[ 2 ] === 'string' || argt[ 2 ] === 'array') ) config.alias = args[ 2 ];

    if ( type ) config.type = <OptionType> type.name.toLowerCase()

    // config is ALWAYS last parameter, so we can do it like this
    if ( len > 0 && argt[ len - 1 ] === 'object' ) merge(config, args[ len - 1 ]);


    return (target: Object, key: string | symbol) => {
        let m = meta(target);
        m.set('options', [ { key, config } ].concat(m.get<any>('options', [])))
    }
}

function argument(config?: i.ArgumentConfig): PropertyDecorator
function argument(desc: string, config?: i.ArgumentConfig): PropertyDecorator
function argument(desc: string, type: Function, config?: i.OptionConfig): PropertyDecorator
function argument(...args: any[]): PropertyDecorator {
    let len: number              = args.length
    let argt: string[]           = args.map(arg => kindOf(arg));
    let config: i.ArgumentConfig = {}
    if ( len > 0 ) config.desc = args[ 0 ]
    if ( len > 1 && argt[ 1 ] === 'function' ) config.type = args[ 1 ];

    // config is ALWAYS last parameter, so we can do it like this
    if ( len > 0 && argt[ len - 1 ] === 'object' ) merge(config, args[ len - 1 ]);

    return (target: Object, key: string | symbol) => {
        let m = meta(target);
        m.set('arguments', [ { key, config } ].concat(m.get<any>('arguments', [])))
    }
}


export { command, group, root, helper, option, global, argument }