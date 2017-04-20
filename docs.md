# Console

## groups and commands

```
import {command} from '@radic/console'
import {GitGroup} from './git'

@command({
    name: 'init',
    group: GitGroup
})
export class GitInitCommand {
    g:boolean
    
    @option('Init globally') 
    global:boolean
    
    @argument('A nice name')
    name:string
    
    constructor(
        @inject('helpers.output') public out:Output
    ){}
    
    handle(){
        this.out.dump(this.global)
        if(this.global){
            //
        }
    }
}
```