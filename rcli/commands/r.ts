import {command,inject,Output} from '../../src'

@command({

})
export class RcliCmd {

    @inject('cli.helpers.output')
    out:Output;

    handle(...args:any[]){
        // this.out.dump(this)
        // this.out.success('asdf')


    }
}