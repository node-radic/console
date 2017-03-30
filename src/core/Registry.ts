import { Container } from "./ioc";
import * as _ from 'lodash';
import i from '../interfaces'
import { CliMode } from "./cli";
import { merge } from 'lodash'
import { getRandomId, inspect, kindOf } from '@radic/util'


/**
 * Contains all the defined commands and groups
 */
@Container.singleton('console.registry')
export default class Registry {
    get commands(): i.CommandConfig[] {
        return this._commands;
    }

    get groups(): i.GroupConfig[] {
        return this._groups;
    }

    private _groups: i.GroupConfig[]     = []
    private _commands: i.CommandConfig[] = []
    private _rootGroup: i.GroupConfig;
    private _rootCommand: i.CommandConfig;

    constructor(
        @Container.inject('console.nodes.defaults.group') private _groupDefaults:i.GroupConfig,
        @Container.inject('console.nodes.defaults.command') private _commandDefaults:i.CommandConfig
    ) {
        this._rootGroup   = this.createGroupConfig({
            name         : '_root',
            globalOptions: {}
        })
        this._rootCommand = this.createCommandConfig({
            name: '_root'
        })
    }

    getRoot<T extends i.NodeConfig>(mode: CliMode): T {
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

    protected createGroupConfig(options: i.GroupConfig = {}): i.GroupConfig {
        options = _.merge({}, this._groupDefaults, options);
        if ( options.cls === null ) {
            let fn     = function () {}
            let desc   = Object.getOwnPropertyDescriptor(fn, 'name');
            desc.value = this.makeid()
            Object.defineProperty(fn, 'name', desc);
            options.cls = fn;
        }
        return options;
    }

    protected createCommandConfig(options: i.CommandConfig = {}) {
        options = _.merge({}, this._commandDefaults, options);

        if ( options.cls === null ) {
            let fn     = function () {}
            let desc   = Object.getOwnPropertyDescriptor(fn, 'name');
            desc.value = this.makeid()
            Object.defineProperty(fn, 'name', desc);
            options.cls = fn;
            if ( options.handle !== null ) {
                options.cls.prototype.handle = options.handle
            }
        }

        return options;
    }


    addGroup(options: i.GroupConfig): i.GroupConfig {
        this._groups.push(options = this.createGroupConfig(options));
        return options;

    }

    addCommand(options: i.CommandConfig): i.CommandConfig {
        options = this.createCommandConfig(options);
        this._commands.push(options);
        return options;
    }

}
