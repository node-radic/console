// Single option declaration configuration for group configuration and command configuration
import { merge } from 'lodash'
import { interfaces as i } from '../interfaces'
import { Container } from "./ioc";
export type OptionType = 'string' | 'boolean' | 'number'

// Single argument declaration configuration for command configuration
export type ArgumentType = 'string' | 'number' | 'boolean' | 'array';

export type NodeType = 'group' | 'command'

export abstract class Node<C> implements i.Node<C> {

    name: string
    desc: string
    options: i.Options
    config: C

    handle(): boolean | any | void {

    }
}


export abstract class Group extends Node<i.GroupConfig> {
}

export abstract class Command extends Node<i.CommandConfig> {
    arguments: i.Arguments
}


const defaultNodeConfig: i.NodeConfig = {
    name   : null,
    type   : null,
    group  : null,
    cls    : null,
    options: {},
    aliases: [],
    desc   : ''
}

const defaultGroupConfig: i.GroupConfig = merge({}, defaultNodeConfig, <i.GroupConfig> {
    type         : 'group',
    globalOptions: {},
    handle       : null
})

const defaultCommandConfig: i.CommandConfig = merge({}, defaultNodeConfig, <i.CommandConfig> {
    type     : 'command',
    arguments: {},
    handle   : null,

})

Container.constant('console.nodes.defaults.group', defaultGroupConfig)
Container.constant('console.nodes.defaults.command', defaultCommandConfig)