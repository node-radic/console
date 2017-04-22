import { clone, merge } from "lodash";
import { interfaces as i } from "../interfaces";
import { Container } from "./ioc";

// Single option declaration configuration for group configuration and command configuration
export type OptionType = 'string' | 'boolean' | 'number'

// Single argument declaration configuration for command configuration
export type ArgumentType = 'string' | 'number' | 'boolean' | 'array'

export type NodeType = 'group' | 'command'

const argument: i.ArgumentConfig = {
    type    : 'string',
    desc    : '',
    required: false
}

const option: i.OptionConfig = {
    type  : 'boolean',
    desc  : '',
    alias : [],
    array : false,
    global: false
}

const node: i.NodeConfig = {
    name    : null,
    type    : null,
    group   : null,
    cls     : null,
    options : {},
    aliases : [],
    desc    : '',
    instance: null
}

const group: i.GroupNodeConfig = merge({}, node, <i.GroupNodeConfig> {
    type  : 'group',
    handle: null
})

const command: i.CommandNodeConfig = merge({}, node, <i.CommandNodeConfig> {
    type     : 'command',
    arguments: {},
    handle   : null,

})


class Defaults implements i.NodesDefaults {
    get argument(): i.ArgumentConfig { return clone(argument) }

    get option(): i.OptionConfig { return clone(option) }

    get node(): i.NodeConfig { return clone(node) }

    get group(): i.GroupNodeConfig { return clone(group) }

    get command(): i.CommandNodeConfig { return clone(command) }
}

Container.constant('console.defaults.nodes', new Defaults())