import { command, CommandArguments, CommandConfig, Config, lazyInject, Log, OptionConfig, OutputHelper } from "../../src";

@command('connect {command}', 'SSH connection helper', ['add'], <CommandConfig> {
    onMissingArgument: 'help',
    helpers: {
        help: {
            app: { title: 'SSH Connection Helper'}
        }
    }
})
export class RcliConnectCmd {

    _config: CommandConfig
    _options: OptionConfig[]

    @lazyInject('cli.helpers.output')
    out: OutputHelper;

    @lazyInject('cli.log')
    log: Log;

    @lazyInject('cli.config')
    config: Config;


    handle(args:CommandArguments, argv: any[]) {
        this.log.info('args', args);
        this.log.info('argv', argv);
    }
}
export default RcliConnectCmd