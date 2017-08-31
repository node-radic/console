# Radical Console

- [Examples](#examples)
- [Bootstrapping](#bootstrapping)
- [Creating commands](#creating-commands)
- [Creating a command structure](#creating-a-command-structure)
- [Core API & Bindings](#core-api--bindings)
    -  [Cli](#)
    -  [Config](#)
    -  [Container](#)
    -  [Events/Dispatcher](#)
    -  [Helpers](#)
    -  [Log](#)
    -  [decorators](#)
    -  [defaults](#)
    -  [utils](#)
- [Helpers](#helpers)
    -  [help](#)
    -  [input](#)
    -  [output](#)
    -  [verbose](#)
- [Plugins](#plugins)
    -  [database](#)
    -  [crypro](#)

Examples
--------
- [radical-console-demo](https://github.com/node-radic/radical-console-demo) a basic example
- [@radic/cli](https://github.com/node-radic/rcli) a advanced example

Bootstrapping
-------------
- This should be the `bin` entry point specified in **package.json**.
- This  could contain things like configuration, overrides, adding of features and the likes.
- After that's done, it requires the 'root' command and pass it to the start function.
The Cli will then parse the `process.argv`


Creating Commands
-----------------
### Inline
```typescript
#!/usr/bin/env node
import "reflect-metadata";
import { cli, CommandArguments, InlineCommand } from "radical-console";


cli.parse({
    options  : [
        { key: 's', name: 'symlink', description: 'sym is good for link' }
    ],
    arguments: [
        { name: 'path', description: 'The path to the stuff', required: true, type: 'string' }
    ],
    action   : (args: CommandArguments) => {
        /** @this {InlineCommand} */
        console.log('hello!')
        console.dir({ args, me: this });
    }
});
```

### Single
```typescript
#!/usr/bin/env node
import "reflect-metadata";
import { cli, command, CommandArguments, inject, OutputHelper } from "radical-console";

@command('single', {
    options: [
        { key: 'a', name: 'append', description: 'append it' }
    ]
})
export default class {
    @inject('cli.helpers.output')
    out: OutputHelper;

    handle(args: CommandArguments, argv: string[]) {
        this.out.success('YES!')
    }
}

cli.helper('output').start(__filename);
```

Creating a command structure
----------------------------

#### Bootstrapping
**`bin/foobar.ts`**

```typescript
#!/usr/bin/env node
import { cli } from "radical-console";

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

Core API & Bindings
-------------------
### Cli
- **Binding**: `cli`
- **API**: [Dispatcher](classes/cli.html)
...

### Config
- **Binding**: `cli.config`
- **API**: [Config](classes/dispatcher.html)
- **From**: `@radic/util`

Configuration is stored here. It works like Grunt config, enabling you to use inline javascript.

### Container
- **API**: [Container](classes/container.html)
- **From**: `inversifyjs`

The IoC container is extended from InversifyJS


### Events/Dispatcher
- **Binding**: `cli.`
- **API**: [Dispatcher](classes/dispatcher.html)
- **From**: `eventemitter2`

Event dispatcher. Bound to `cli.events` as singleton. Utilizes EventEmitter2 under the hood.
It adds some extra functionality, primarily the fire(), halt() and dispatch() methods.
The fire() class expects a subclass of Event to be provided, which will be passed to the listeners.
This is the preferred way of firing events within the application

### Helpers
- **Binding**: `cli.helpers`
- **API**: [Helpers](classes/helpers.html)
...

### Log
**Binding**: `cli.`

**From**: `winston`


### decorators
**Binding**: `cli.`
...

### defaults
**Binding**: `cli.`
...

### utils
**Binding**: `cli.`
...


Helpers
-------


Plugins
-------





Quick glance
------------
