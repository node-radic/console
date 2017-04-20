import {Output , inject, group, root, Cli } from "../src";

@group({
    options: {
        V: { alias: 'version', desc: 'Show application version' }
    }
})
@root({
    globalOptions: {
        h: { alias: 'help', desc: 'Show this help text' },
        v: { alias: 'verbose', desc: 'Be more verbose', count: 3 }
    }
})
export class Root {
    version: boolean

    constructor(@inject('console.cli') private cli: Cli,
                @inject('console.helpers.output') private out: Output) {

    }

    handle() {
        if ( this.version ) {
            this.out.line(this.cli['version'])
        }
    }
}