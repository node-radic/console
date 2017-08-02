import { Config ,CommandConfig,OptionConfig,Cli, command, lazyInject, Log, OutputHelper, HelpHelper } from "../../src";

@command('r {command:string@any of the listed commands}', <CommandConfig> {
    isGroup: true,
    // subCommands: [ 'connect' ],
    alwaysRun  : true,
    onMissingArgument: 'help'
})
export class RcliCmd {
    // automaticly added
    _config: CommandConfig
    _options: OptionConfig[]
    showHelp: () => void

    @lazyInject('cli.log')
    log: Log;

    @lazyInject('cli.config')
    config: Config;


    always(){
        if ( this.config('debug') === true ) {
            this.log.level = 'debug';
            this.log.debug('Debug is enabled')
        }
    }

    handle(){

    }
}
export default RcliCmd