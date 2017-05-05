import { group, inject, option, Output, root } from "../../../src";


@root()
@group()
export class Root {

    @option('Show version', 'V')
    version: boolean

    constructor(@inject('console.helpers.output') private out: Output) {

    }

    handle() {
        this.out.success('This is the @root group.')
        if ( this.version ) {
            this.out.line('1.4.6')
        }
    }
}