import { helper } from "../decorators";
import { HelperOptionsConfig } from "../interfaces";
import { inject } from "../core/Container";
import { LoggerInstance } from "winston";
import { setVerbosity} from "../core/Log";
import { CliExecuteCommandParsedEvent, CliExecuteCommandParseEvent } from "../core/events";
import { kindOf } from "@radic/util";

@helper('verbose', {
    singleton: true,
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
export class VerbosityHelper {
    config: HelperOptionsConfig;

    @inject('cli.log')
    log: LoggerInstance;

    public onExecuteCommandParse(event: CliExecuteCommandParseEvent) {
        event.cli.global(this.config.option.key,{
            name       : this.config.option.name,
            count      : true,
            // tyhpe
            description: 'increase verbosity (1:verbose|2:data|3:debug|4:silly)'
        })
    }

    public onExecuteCommandParsed(event: CliExecuteCommandParsedEvent) {
        if ( event.argv[ this.config.option.key ] ) {
            let level: number = parseInt(event.argv[ this.config.option.key ]);
            setVerbosity(level);
            this.log.verbose(`Verbosity set (${level} : ${this.log.level})`)
        }
    }
}