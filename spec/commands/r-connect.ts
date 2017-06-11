import { command, CommandArguments, CommandConfig, Config, lazyInject, Log, OptionConfig, Output } from "../../src";

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
    out: Output;

    @lazyInject('cli.log')
    log: Log;

    @lazyInject('cli.config')
    config: Config;


    handle(args:CommandArguments, argv: any[]) {
        this.log.info('args', args);
        this.log.info('argv', argv);
        this.log.info('config', this._config)
    }
}
export default RcliConnectCmd