import { command, option, cli } from "../../../src";

cli.globals({
    v: {
        count:true,
        name: 'verbose',
        description: 'Extra verbose output'
    }
})

@command({
    subCommands: [ 'con' ]
})
export class RCliCmd {

    @option('f', 'forces execution, even when its shouldnt')
    force: boolean = false;

    public handle() {
        console.log(`THIS IS${this.force ? '' : ' NOT'} FORCED`)
    }
}
