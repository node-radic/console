# Radic Console
todo
[[ TOC ]]

## Decorators

### Cli
- @group(varArgs) : Class
- @command(varArgs) : Class
- @root(varArgs) : Class

### IoC
- @inject(id) : Property
- @bindTo(id) : Class
- @singleton(id) : Class
- @provide(id) : Class

## Bindings
all bindings are prefixed `console`. So `console.cli` etc..

### Core
| name      | binds         | type      |
|:----------|:--------------|:----------|
| .cli      | Cli           | singleton |
| .events   | Events        | singleton |
| .registry | Registry      | singleton |
| .router   | Router        | singleton |
| .route    | Route         | binding   |
| .parser   | Parser        | binding   |
| .config   | config/Config | constant  |

### Helpers
for usage in commands and group classes. all helpers bindings are prefixed `console.helpers`. So `console.helpers.output` etc..

| name       | binding   | type    |
|:-----------|:----------|:--------|
| .input     | Input     | binding |
| .output    | Output    | binding |
| .describer | Describer | biding  |



## Usage
todo