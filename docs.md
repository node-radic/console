# Console

## Overview
### Modes
The Cli instance can be in **command** or __groups__ mode.

#### Mode: command

#### Mode: groups

- Groups [`@group`](interfaces/interfaces.groupconfig.html) and commands [`@command`](interfaces/interfaces.commandconfig.html) are 'nodes'.
- One of those nodes needs to the Root `@root` node


## groups and commands

```

```

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