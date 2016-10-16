# Radic Console
A NodeJS console/cli helper. Inspired by yargs however providing configurable/extendable extra features. 
The library is NOT a yargs clone but written from scratch in Typescript. Using Inversify Inversion of Control at its core.
 
- Written in Typescript
- Class / Interface based approach
- Inversion of Control (Extend / Modify everything)
- Commands, Sub Commands and Command Hierarchies
- Arguments, Options, Long options, aliases, types, etc
- Using the decorators is optional. May also use the 'old fashioned way' 

| Class          | Description                                   |
|:---------------|:----------------------------------------------|
| App            | The IoC Kernel. Contains all bindings         |
| Config         | Configuration class holding all configuration |
| Log            | Log class                                     |
| Cli            | Abstract base Cli                             |
| CommandsCli    |                                               |
| ArgumentsCli   |                                               |
| Command        |                                               |
| Group          |                                               |
| CommandFactory |                                               |
| Descriptor     |                                               |
| Input          |                                               |
| Output         |                                               |


cli.definition = ICommandsDefinition
cli.globalDefinition = IOptionsDefinition
cli.parse > ICommandsDefinitionParser & IOptionsDefinitionParser
cli.parsed = IParsedCommandsDefinition
cli.parsed.global = IParsedOptionsDefinition


`index.ts`
```typescript
import {kernel as container,CommandsCli,Command,Group,command,group} from './src' // src = @radic/console
import './commands'
// app is the IoC container (kernel from inversify)
let cli = container.commandsCli()

// DEFINE/CONFIGURE
// define some global options
cli.globalDefinition.options({
    h: {alias:'help', desc: 'The help option', boolean: true}
})

// define root options. only available without commands like: 
// app -v                   # available
// app project create -v    # not available
cli.definition.options({
    v: {alias: 'version', desc: 'Show version', boolean: true}
})

// set some config using helper functions
cli.config
    .title('Radic Console Preview')
    .description('A preview of a command based CLI')
    .version('1.0.1');
    
// or directly
cli.config.set('app.title', 'Radic Console Preview')
cli.config.set('app', { title: 'Radic Console Preview', version: '1.0.1' })


// PARSE
cli.parse(process.argv)
let parsed = cli.parsed;

// HANDLE
if ( parsed.opt('d') ) {
    cli.log.setLevel('debug')
}

if ( parsed.opt('v') ) {
    cli.out.line(cli.config('app.version'));
    cli.exit();
}

if ( parsed.isCommand ) {
    parsed.command.fire().then(() => {
        cli.exit();
    });
} else if ( parsed.isGroup ) {
    parsed.group.showHelp();
} else if ( parsed.isRoot ) {
    cli.showHelp()
} else {
    cli.fail('No options or arguments provided.  Use the -h or --help option to show what can be done')
}
```

`commands.ts`
```typescript
// app project
@group('project', 'Project commands')
export class ProjectGroup extends Group {
    handle(){ this.listChildren() }
}

// app project create <name> [-d|--dry-run]
@command('create', 'Create a new project', ProjectGroup)
export class ProjectCreateCommand extends Command {
    arguments = {
        name: {desc: 'The name of the project', required: true, type: string }
    }
    options = {
        d: { alias: 'dry-run', desc: 'Does not generate or alter files' }
    }
    handle(){
        this.arg('name')
        this.hasOpt('d') === this.hasOpt('dry-run')
        if(this.opt('d')){
        
        }
        // do stuff...
    }
}

// app list
@command('list', 'List app')
export class ListCommand extends Command {
    handle(){
        let table = this.out.table(['Col 1 head', 'Col 2 head'])
        table.push(['First', 'something'])
        this.out.write(table);
        this.log.debug(table.length)
    }
}

```


## Some examples
### Output
```typescript
import {kernel} from './src' // src = @radic/console
let cli = container.commandsCli()
cli.out.line(`
{f:#333.b:#FFAA00}Background and foreground colored 
{/f}but now only background 
{bold}with bold text
{/bold}or without bold text {/b.f:red} without background but red foreground{reset}
`)
// uses @radic/console-colors
```

### Configure (output)
```typescript
import {kernel} from './src' // src = @radic/console
let cli = container.commandsCli()
cli.config()
// equals
cli.config.get()

cli.config.set('output.colors.enabled', true)
cli.config.set('output.colors.title', 'green bold')
cli.config.set('output.colors.header', 'cyan')

```

### Modify/extend help output using IoC                       
```typescript
import {kernel, BINDINGS, Descriptor, IDescriptor,IOptionsDefinition} from './src'  
let cli = container.commandsCli()
class MyDescriptor extends Descriptor {
    options(definition:IOptionsDefinition){
        super.options(definition)
        this.out.line('{bold}Total{reset}:' + definition.getOptions().length)
    }
}
kernel.bind<IDescriptor>(BINDINGS.DESCRIPTOR).to(MyDescriptor)
```


### Modify/extend the CLI                       
```typescript
import {kernel, BINDINGS, Descriptor, CommandsCli, IDescriptor,IOptionsDefinition} from './src'
class MyCommandsCli extends CommandsCli {
    parse(argv:any[]){
        super.parse(argv)
    }
    fire(){
        this.parsed.command.fire();
    }
}
let cli = kernel.commandsCli<MyCommandsCli>(MyCommandsCli)
class MyDescriptor extends Descriptor {
    options(definition:IOptionsDefinition){
        super.options(definition)
        this.out.line('{bold}Total{reset}:' + definition.getOptions().length)
    }
}
kernel.bind<IDescriptor>(BINDINGS.DESCRIPTOR).to(MyDescriptor)
```