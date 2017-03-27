import { Container } from "./ioc";
import * as _ from 'lodash';
import interfaces from '../interfaces'
import { CliMode } from "./cli";
import { merge } from 'lodash'
import { getRandomId, inspect, kindOf } from '@radic/util'



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
            name: '_root',
            globalOptions: {}
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

        if ( options.cls === null ) {
            let fn     = function () {}
            let desc   = Object.getOwnPropertyDescriptor(fn, 'name');
            desc.value = this.makeid()
            Object.defineProperty(fn, 'name', desc);
            options.cls = fn;
            if(options.handle !== null){
                options.cls.prototype.handle = options.handle
            }
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

}
