import { Cli, group, inject, Output, root, global, option } from "../../../src";


@root()
@group()
export class Root {


    @global()
    @option('Disable the use of colors', 'C')
    noColors: boolean;

    @option('Show version', 'V')
    version: boolean
    constructor(@inject('console.cli') private cli: Cli,
                @inject('console.helpers.output') private out: Output) {

    }

    handle() {
        if ( this.noColors) {
            this.out.config.colors = false;
        }
        if ( this.version ) {
            this.out.line('1.4.6')
        }
    }
}