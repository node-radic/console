# struct

### help

in CommandsCLI
```
definition.help() // only for isRoot
globalDefinition.help() // for all

CommandsCli.parse(){
    definition.mergeOptions(globalDefinition.getOptions)
}
```