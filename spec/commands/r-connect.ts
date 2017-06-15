import { command, CommandArguments, CommandConfig, Config, lazyInject, Log, OptionConfig, OutputHelper } from "../../src";

@command('connect [command]', 'SSH connection helper', ['add'], <CommandConfig> {
    helpers: {
        help: {
            app: { title: 'SSH Connection Helper'}
        }
    }
})
export class RcliConnectCmd {
    showHelp: () => void
    _config: CommandConfig
    _options: OptionConfig[]

    @lazyInject('cli.helpers.output')
    out: OutputHelper;

    @lazyInject('cli.log')
    log: Log;

    @lazyInject('cli.config')
    config: Config;

    handle(args:CommandArguments, argv: any[]) {
        this.showHelp()
        this.out.line('alright')
    }
}
export default RcliConnectCmd
