import { command, inject, Log, Output } from "../../src";
import { RConfig } from "../lib";

@command('connect', 'SSH connection helper', {
    subCommands: [ 'add', 'edit', 'list', 'show' ],
    usage      : 'connect <command>',
    example    : `$ connect list
$ connect show <name> [options]
$ connect add <name> [options]
$ connect edit <name> [options]
$ connect remove <name>`
})
export default class RcliConnectCmd {

    @inject('cli.helpers.output')
    out: Output;

    @inject('cli.log')
    log: Log;

    @inject('config')
    config: RConfig;
    //
    // handle(...args: any[]) {
    //
    //     if ( this.list ) {
    //         this.handleList();
    //     } else if ( this.set ) {
    //         let add = this.config.has('connect.' + this.set);
    //         if ( add ) {
    //             this.handleAdd();
    //         } else {
    //             this.handleSet()
    //         }
    //     }
    //
    //
    // }
    //
    // protected handleList() {
    //
    //     let cons = this.config.get('connect', {});
    //     Object.keys(cons).forEach(con => {
    //         this.out.line(' - ' + con)
    //     })
    // }
    //
    // protected handleSet() {
    //     let con = this.config.get<any>('connect.' + this.set, {});
    //     [ 'host', 'port', 'method', 'mountLocal', 'mountRemote' ].forEach(prop => {
    //         if ( this[ prop ] ) {
    //             con[ prop ] = this[ prop ];
    //         }
    //     })
    //     this.config.set('connect.' + this.set, con);
    // }
    //
    // protected handleAdd() {
    //     let con = {
    //         host  : this.host,
    //         port  : this.port || 22,
    //         method: this.method || 'key',
    //
    //     }
    //     this.config.set('connect.' + this.set, con);
    // }
}