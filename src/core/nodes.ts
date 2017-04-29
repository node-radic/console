import { cloneDeep, merge } from "lodash";
import { interfaces as i } from "../interfaces";
import { bindTo } from "./Container";
import { meta } from "../utils";

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

@bindTo('console.defaults.nodes')
export class Defaults implements i.NodesDefaults {
    getArgument(): i.ArgumentConfig { return cloneDeep(argument) }

    getOption(): i.OptionConfig { return cloneDeep(option) }

    getNode(): i.NodeConfig { return cloneDeep(node) }

    getGroup(): i.GroupNodeConfig { return cloneDeep(group) }

    getCommand(): i.CommandNodeConfig { return cloneDeep(command) }
}

export function addOption(keys: string[], optionConfig: i.OptionConfig, config: i.NodeConfig) {
    let name: string    = keys.sort((a, b) => a.length - b.length).shift()
    meta(config.cls).set('options', [
        merge({
            config: { name, keys },
            key   : name
        }, {
            config: optionConfig
        })
    ].concat(meta(config.cls).get<any>('options', [])))

}