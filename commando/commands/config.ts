import { Group, group, command, Command, IArgumentDefinition } from "../../src";
import { COMMANDO, IConfigProperty } from "../core";
import { kernel } from "../../src";
import { IOptionsDefinition, IOption, IJoinedOption } from "../../src/definitions/definitions";
import { dotize } from "@radic/util";

// @group('config', 'Configuration', 'Manage the global and local configuration')
export class ConfigGroup extends Group {
}

// @command('list', 'List Configuration', 'Give the current working directory a bit of R.', ConfigGroup)
export class ListConfigCommand extends Command {
    arguments: { [name: string]: IArgumentDefinition }|string[] = {
        type: { desc: 'The config type (console|commando)', type: 'string', default: 'commando' }
    }

    handle() {
        this.out.subtitle(this.arg('type'))
        this[ this.arg('type') ].apply(this)
    }

    commando() {
        this.out.dump(kernel.get<IConfigProperty>(COMMANDO.CONFIG))
    }

    console() {
        this.out.dump(this.config.raw())
    }
}


/*
 l : list

 */
@command('config', 'Configuration Tool', 'Show, add, edit and remove configuration values.')
export class ConfigCommand extends Command {

    arguments: { [name: string]: IArgumentDefinition }|string[] = {
        key  : { desc: 'The config key', type: 'string' },
        value: { desc: 'The config key', type: 'string' },
        type : { desc: 'The config key', type: 'string' }
    }

    options = {
        list: { alias: 'l', desc: 'Output configuration as dot-notaded list', string: true },
        tree: { alias: 't', desc: 'Output configuration as tree', string: true }
    }

    handle() {
        let k = this.arg('key')
        let v = this.arg('value')
        let t = this.arg('type')

        if ( this.opt('l') || this.opt('t') ) {
            let items = this.config(this.arg('key'));
            return this.out.dump(this.opt('l') ? dotize(items) : items);
        }

        if ( ! this.hasArg('value') ) {
            return this.out.dump(this.config(k))
        }

        if ( ! this.arg('type') ) {
            return this.fail(`Could not set value for [${k}]. Missing the the type (third argument).`)
        }

        if ( t === 'number' ) {
            v = parseInt(v);
        }

        this.config.set(k, JSON.parse(v));
    }
}



