import { Cli, cli, CliConfig, Dictionary, HelperOptionsConfig } from "../../src";
import { objectLoop } from "@radic/util";

export function bootstrap(helpers: Dictionary<HelperOptionsConfig>, config: CliConfig = {}): Cli {
    cli.config.merge(config)

    objectLoop(helpers, (name, config) => {
        cli.helper(name, config)
    })

    return cli;
}