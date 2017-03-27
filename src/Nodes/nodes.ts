// Single option declaration configuration for group configuration and command configuration
import interfaces from '../interfaces'
export type OptionType = 'string' | 'boolean' | 'number'

// Single argument declaration configuration for command configuration
export type ArgumentType = 'string' | 'number' | 'boolean' ;

export type NodeType = 'group' | 'command'


export abstract class AbstractNode<C> {
    name: string
    desc: string
    options: interfaces.Options
    handle() : boolean | any | void {

    }
    config: C
}


export abstract class Group extends AbstractNode<interfaces.GroupConfig>{
}

export abstract class Command extends AbstractNode<interfaces.CommandConfig> {
    arguments: interfaces.Arguments
}
