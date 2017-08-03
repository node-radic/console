# Radical Console

- [Bootstrapping](#)
- [Creating commands](#)
- [Creating a command structure](#)
- [Core API & Bindings](#)
    -  [Cli](#)
    -  [Config](#)
    -  [Container](#)
    -  [Events/Dispatcher](#)
    -  [Helpers](#)
    -  [Log](#)
    -  [decorators](#)
    -  [defaults](#)
    -  [utils](#)
- [Helpers](#)
    -  [help](#)
    -  [input](#)
    -  [output](#)
    -  [verbose](#)
- [Plugins](#)
    -  [database](#)
    -  [crypro](#)


Bootstrapping
-------------
- This should be the `bin` entry point specified in **package.json**.
- This  could contain things like configuration, overrides, adding of features and the likes.
- After that's done, it requires the 'root' command and pass it to the start function.
The Cli will then parse the `process.argv`


Creating Commands
-----------------

Creating a command structure
----------------------------

Core API & Bindings
-------------------


Helpers
-------


Plugins
-------





Quick glance
------------

#### Bootstrapping
**`bin/foobar.ts`**

```typescript
#!/usr/bin/env node
import { cli } from "@radic/console";

// override some of the default config
cli.config.merge({
    parser: { yargs: { 'boolean-negation': false } },
    commands: { onMissingArgument: 'help' }
})

// enable helpers you'd like to use and override configuration to your needs.
// A lot more on this can be found in the documentation 
cli
    .helper('input')
    .helper('output', { // adds global options: 
        // -q|--quiet       : disable any output
        // -C|--no-colors   : disable colors
        options: {
            quiet : { enabled: true }, // key: 'q', name: 'quiet'
            colors: { enabled: true, } // key: 'C', name: 'no-colors'
        }
    })
    .helper('help', {
        showOnError        : true,
        option             : { enabled: true, } //key: 'h', name: 'help' }
    })
    .helper('verbose', {
        option: { key: 'v', name: 'verbose' }
    });
        
// require the 'root' command and pass it to the start function 
cli.start(require('../commands/foobar'));

```

#### Group definition
The 'root' command is in this case configured as a group
This means we'll be making a hierarchical command tree

**`commands/foobar.ts`**
```typescript
import { command, option, inject, OutputHelper, InputHelper, Config, LoggerInstance } from "@radic/console";


@command(`foobar {command:string@any of the existing sub-commands/groups}`, {
    description: 'Foobar eats your foo\'s and bars',
    isGroup: true
})
export default class FoobarGroup {}
```
----------------------


**`commands/foobar/git.ts`**
```typescript
import { command, option, inject, OutputHelper, InputHelper, Config, LoggerInstance } from "@radic/console";

@command(`git {command:string@any of the existing sub-commands}`, 'Git Operations')
export default class GitCmd {}
```
----------------------

#### Command definition

**`commands/foobar/git/fetch.ts`**
```typescript
import { command, option, inject, OutputHelper, InputHelper, Config, LoggerInstance, CommandArguments } from "@radic/console";

@command(`fetch
[repository:string@the repository name]
[refspec:string[]@refspecs to fetch]
`, 'Fetches some git stuff', { 
    examples: `{bold}Fetching `
})
export default class GitFetchCmd {
    @inject('cli.helpers.output')
    out: OutputHelper;
    
    @inject('cli.helpers.input')
    ask: InputHelper;
    
    @inject('cli.config')
    config: Config;
    
    @inject('cli.log')
    log: LoggerInstance;
    
    @option('a', 'append to .git/FETCH_HEAD instead of overwriting')
    append:boolean
    
    @option({ description: 'path to upload pack on remote end' })
    uploadPack:string
    
    // some random stuff
    async handle(args:CommandArguments, argv:string[]){
        let repository = args.repository || await this.ask.question('Please enter a repository name');
        
        if(this.append){
            repository += 'appended' 
        }
        args.refspec.forEach((refspec:string) => this.log.verbose(refspec))        
    }
}
```