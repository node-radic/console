import { Group, group, Command, command } from "../../src";

@group('seb', 'Seb commands', 'Provides commands for seb')
export class SebGroup extends Group {

}

@command('show', 'Show Seb', 'Show this seb', SebGroup)
export class ShowSebCommand extends Command {
    options: {
        g: {alias:'green', desc: 'Show green instead of yellow'}
    }
    handle(){
        let color = this.opt('g') ? 'green' : 'yellow'
        this.line(`This is the {${color}}show {bold}seb{/${color}} command{/bold}`)
    }
}
