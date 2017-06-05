import { helper } from "../decorators";
import { CliExecuteCommandParsedEvent, CliExecuteCommandParseEvent } from "../core/Cli";
import { HelperOptionsConfig } from "../interfaces";
import { inject } from "../core/Container";
import { LoggerInstance } from "winston";
import { setVerbosity } from "../core/log";

@helper('verbose', {
    config   : {
        option: {
            enabled: true,
            key    : 'v',
            name   : 'verbose'
        }
    },
    listeners: {
        'cli:execute:parse' : 'onExecuteCommandParse',
        'cli:execute:parsed': 'onExecuteCommandParsed'
    }
})
export class Verbose {
    config: HelperOptionsConfig;

    @inject('cli.log')
    log: LoggerInstance;

    onExecuteCommandParse(event: CliExecuteCommandParseEvent) {
        event.options.push({
            key        : this.config.option.key,
            name       : this.config.option.name,
            count      : true,
            description: 'increase verbosity (1:verbose|2:data|3:debug|4:silly)'
        })
    }

    onExecuteCommandParsed(event: CliExecuteCommandParsedEvent) {
        console.log('onExecuteCommandParsed', event.argv)

        if ( event.argv[ this.config.option.key ] ) {
            let level: number = parseInt(event.argv[ this.config.option.key ]);
            setVerbosity(level);
            this.log.verbose(`Verbosity set (${level} : ${this.log.level})`)
        }
    }
}