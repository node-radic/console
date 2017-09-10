import 'chai/register-assert';  // Using Assert style
import 'chai/register-expect';  // Using Expect style
import 'chai/register-should';  // Using Should style
import { Cli, cli, CliConfig, Dictionary, HelperOptionsConfig } from "../../src";
import { objectLoop } from "@radic/util";

export function bootstrap(helpers: Dictionary<HelperOptionsConfig>, config: CliConfig = {}): Cli {
    cli.config.merge(config)

    objectLoop(helpers, (name , config) => {
        cli.helper(name as any, config)
    })

    return cli;
}