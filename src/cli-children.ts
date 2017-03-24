// Single option declaration configuration for group configuration and command configuration
import interfaces from './interfaces'
export type OptionType = 'string' | 'boolean' | 'number'

// Single argument declaration configuration for command configuration
export type ArgumentType = 'string' | 'number' | 'boolean' ;

export type CliChildType = 'group' | 'command'

export interface G2roup {

}
export class InlineGroup implements Group {
    options: interfaces.Options
}

export class Group {
    options: interfaces.Options
}

export class Command {
    arguments: interfaces.Arguments
    options: interfaces.Options
    handle(){

    }
}

