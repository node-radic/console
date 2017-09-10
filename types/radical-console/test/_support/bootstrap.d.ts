import 'chai/register-assert';
import 'chai/register-expect';
import 'chai/register-should';
import { Cli, CliConfig, Dictionary, HelperOptionsConfig } from "../../src";
export declare function bootstrap(helpers: Dictionary<HelperOptionsConfig>, config?: CliConfig): Cli;
