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

###### Decorator options
```typescript
@command(name: string, config?: CommandConfig)
@command(name: string, description?: string, config?: CommandConfig)
@command(name: string, description?: string | CommandConfig, config?: CommandConfig) 
```
**name**
- The `name` string will be parsed by the [PrepareArgumentsFunction](#) (binding: `cli.fn.arguments.prepare')
- arguments will be passed to the `handle(args)` method

_name/alias declaration_
```typescript
@command(`stringify`) // name will be "stringify", no alias
@command(`stringify|alias-name`) // alias will be "alias-name"
@command(`stringify|3`) // alias will be "str"
@command(`stringify|1`) // alias wil be "s"
```
_argument declaration_
```typescript
@command(`stringify|1
{requiredArg}
[optionalArg]`) // arguments will be passed to the handle(args) function

@command(`stringify|1
{name:string}
{names:string[]}
{foos:string[]@this is the foos description}
{foos2:string[]=['default']@this foos2 has a default value}
{foo:string="foobar"}
{foo:number=2}
{foo:number[]=[1,2]}
{bool:boolean=false}
{bools:boolean[]=[true,false]`)
```

**CommandConfig**

**API**: [CommandConfig](interfaces/command-config.html)



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

### output
- **Binding**: `cli.helpers.output`
- **API**: [OutputHelper](classes/output-helper.html)

##### examples
There's more available then shown in the example, check the declaration files
```typescript
class MyCmd {
    @inject('cli.helpers.output');
    out:OutputHelper
    handle(){
        // access config (readonly)
        this.out.config.colors = true || false // enable / disable coloring
        this.out.config.quiet = true || false // enable / disable writing to stdout
        this.out.config.resetOnNewline = true || false // {reset} after every nl, writeln(), line() etc
        // many more configs available
        
        this.out
        .write('hello').nl
        .writeln('hello')
        .line('hello')
        .beep()
        .line('{blue.bold}all{/blue} methods with string input accept {limegreen}color{/limegreen} codes{reset}')
        
        // all strings are parsed using @radic/console-colors
        console.log(this.out.parse(`
        {bold.red.underline}This is bold, red and underlined.{/red} But we dropped the red.{reset} And just resetted the rest.
        {green.bgBlue.bold}We can also mix openers and closers{/bgBlue.bgYellow./bold./green.blue}And make it really silly.
        {f(#333)}If support for 256 colors is present, you can use the RGB 0 - 6  values. Also, you can provide a fallback{f(#eee).bold.underline}
        
        Fairly advanced things are possible
        {b(green).f(red).bold.underline}Some text{/f.green./underline}greeen stuff{reset}    
        `))
        
        
        let coloredString = '古\n\u001b[1m@\u001b[22m'
        let u = this.out.util
        // get actual string width
        u.width(coloredString)
        // slice, keeps colors correct
        u.slice(coloredString, 2, 5)
        // truncate, keeps colors correct
        u.truncate(coloredString,10)
        // get widest line 
        u.widest(coloredString) //=> 2
               
        this.out
        .line(u.figures.tick)
        .line(u.figures.hamburger)
        .line(u.figures.hamburger)
        .line(u.figures.smiley) // etc
        
        // inspect output
        this.out.dump(this) 
        
        // syntax highlight output (cli-highlight)
        this.out.highlight(readFileSync(__filename, 'utf-8'), 'typescript')
        
        // columns output (columnify)
        this.out.columns({} || [], {
            // columns?: string[],
            // minWidth?: number,
            // maxWidth?: number,
            // align?: 'left' | 'right' | 'center',
            // paddingChr?: string,
            // columnSplitter?: string,
            // preserveNewLines?: boolean,
            // showHeaders?: boolean,
            // dataTransform?: (data) => string,
            // truncate?: boolean,
            // truncateMarker?: string,
            // widths?: { [name: string]: ColumnsOptions },
            // config?: { [name: string]: ColumnsOptions },
        })
        
        // table output (cli-table2)
        let options = {}
        let data = {}
        let rows = []
        this.out.table(data || options || rows) 
        
        // tree output (archy)
        this.out.tree({} as TreeData, {} as TreeOptions, true || false)
               
        // spinner output (ora)
        this.out.spinner()
        
        // multispinner output (multispinner)
        this.out.multispinner()
    }
}
```


Plugins
-------





Quick glance
------------
