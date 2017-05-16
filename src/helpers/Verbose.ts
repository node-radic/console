import { helper } from "../decorators";
import { CliParsedEvent, CliParseEvent } from "../core/Cli";
import { HelperOptionsConfig } from "../interfaces";
import { inject } from "../core/Container";
import { LoggerInstance } from "winston";
@helper('verbose', {
    config   : {
        option: {
            enabled: true,
            key    : 'v',
            name   : 'verbose'
        }
    },
    listeners: {
        'cli:parse' : 'onParse',
        'cli:parsed': 'onParsed'
    },
    bindings : {}
})
export class Verbose {
    config: HelperOptionsConfig;

    @inject('cli.log')
    log:LoggerInstance;

    onParse(event: CliParseEvent) {
        event.globals.push({
            key: this.config.option.key,
            name: this.config.option.name,
            count: true,
            description: 'increase verbosity'
        })
    }

    onParsed(event: CliParsedEvent) {
        console.log('CliParseEvent', event.argv)

        if ( event.argv[ this.config.option.key ] ) {
            let level:number = parseInt(event.argv[ this.config.option.key ]);
            let levels = ['info', 'debug', 'silly'];
            this.log.level = levels[level - 1];
            this.log.debug(event.argv[ this.config.option.key ])
        }
    }
}