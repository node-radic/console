import { Container } from "./ioc";
import * as _ from 'lodash';
import interfaces from './interfaces'
import { CliMode } from "./cli";
import { merge } from 'lodash'
import { getRandomId, inspect, kindOf } from '@radic/util'
import { Group } from "./cli-children";
import { randomBytes } from "crypto";
import { isUndefined } from "util";



/**
 * Contains all the defined commands and groups
 */
@Container.singleton('console.registry')
export class Registry {
    get commands(): interfaces.CommandConfig[] {
        return this._commands;
    }

    get groups(): interfaces.GroupConfig[] {
        return this._groups;
    }

    private _groups: interfaces.GroupConfig[]     = []
    private _commands: interfaces.CommandConfig[] = []
    private _rootGroup: interfaces.GroupConfig;
    private _rootCommand: interfaces.CommandConfig;

    constructor() {
        this._rootGroup   = this.createGroup({
            name: '_root'
        })
        this._rootCommand = this.createCommand({
            name: '_root'
        })
    }

    getRoot<T extends interfaces.CliChildConfig>(mode: CliMode): T {
        if ( mode === "command" ) return <T> this._rootCommand;
        if ( mode === "groups" ) return <T> this._rootGroup;
        throw Error(`Root does not exist for given mode: ${mode}`);
    }

    protected makeid(len: number = 15) {
        var text     = "";
        var possible = "abcdefghijklmnopqrstuvwxyz";

        for ( var i = 0; i < len; i ++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    protected createGroup(options: interfaces.GroupConfig = {}): interfaces.GroupConfig {
        options = _.merge({
            group : null,
            desc  : '',
            cls   : null,
            handle: null,
            type  : 'group',

            options: {},
        }, options);
        if ( options.cls === null ) {
            let fn     = function () {}
            let desc   = Object.getOwnPropertyDescriptor(fn, 'name');
            desc.value = this.makeid()
            Object.defineProperty(fn, 'name', desc);
            options.cls = fn;
        }
        return options;
    }

    protected createCommand(options: interfaces.CommandConfig = {}) {
        options = _.merge({
            group : null,
            desc  : '',
            cls   : null,
            handle: null,
            type  : 'command',

            options  : {},
            arguments: {}
        }, options);

        if ( kindOf(options.group) === 'object' ) {
            options.group = options.group.cls;
        }
        return options;
    }


    addGroup(options: interfaces.GroupConfig): interfaces.GroupConfig {
        this._groups.push(options = this.createGroup(options));
        return options;

    }

    addCommand(options: interfaces.CommandConfig): interfaces.CommandConfig {
        options = this.createCommand(options);
        this._commands.push(options);
        return options;
    }

    private static _instance: Registry;

    private static get instance(): Registry {
        if ( Registry._instance === undefined ) {
            Registry._instance = Container.getInstance().make<Registry>('console.registry')
        }
        return Registry._instance;
    }

    protected static makeOptions<T extends interfaces.CliChildConfig>(cls: any, args: any[]): T {
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

    /**
     *
     * Decorator for commands
     *
     * ```
     * \@Container.command('fetch', <CommandConfig> {
     *      group: GitGroup,
     *      desc: 'Fetch from somewhere',
     *      options: {
     *          a: { type: 'boolean', default: false }
     *      },
     *      arguments: {
     *          source: { type: 'string', required: true, desc: 'The source directory' },
     *          target: { type: 'string', default: './', desc: 'The destination directory, uses the current working directory if not given' }
     *      }
     * })
     * export class FetchCommand {
     *      //...
     * }
     * ```
     * @decorator
     *
     */
    static command(name: string): ClassDecorator;
    static command(options: interfaces.CommandConfig): ClassDecorator;
    static command(name: string, options: interfaces.CommandConfig): ClassDecorator;
    static command(...args: any[]): ClassDecorator {
        return (cls) => {
            let options: interfaces.CommandConfig = Registry.makeOptions<interfaces.CommandConfig>(cls, args);
            Registry.instance.addCommand(options)
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
    static group(name: string): ClassDecorator;
    static group(options: interfaces.GroupConfig): ClassDecorator;
    static group(name: string, options: interfaces.GroupConfig): ClassDecorator;
    static group(...args: any[]): ClassDecorator {
        return (cls) => {
            let options: interfaces.GroupConfig = Registry.makeOptions<interfaces.GroupConfig>(cls, args);
            Registry.instance.addGroup(options)
        }
    }
}
