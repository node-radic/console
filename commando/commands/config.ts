import { Group, group, command, Command, IArgumentDefinition } from "../../src";
import { COMMANDO, IConfigProperty} from "../core";
import { kernel } from "../../src";

@group('config', 'Configuration', 'Manage the global and local configuration')
export class ConfigGroup extends Group {
}

@command('list', 'List Configuration', 'Give the current working directory a bit of R.', ConfigGroup)
export class ListConfigCommand extends Command {
    arguments:{[name: string]: IArgumentDefinition}|string[] = {
        type: { desc: 'The config type (console|commando)', type: 'string', default: 'commando' }
    }
    handle(){
        this.out.subtitle(this.arg('type'))
        this[this.arg('type')].apply(this)
    }

    commando(){
        this.out.dump(kernel.get<IConfigProperty>(COMMANDO.CONFIG))
    }

    console(){
        this.out.dump(this.config.raw())
    }
}



