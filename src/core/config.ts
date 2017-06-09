import { Config as BaseConfig, IConfigProperty } from "@radic/util";
import { container } from "./Container";
import { CliConfig } from "../interfaces";
import { defaults } from "../defaults";
export interface Config extends IConfigProperty {}


const defaultConfig: CliConfig | any = defaults.config();
const _config                        = new BaseConfig(defaultConfig)
export const config: Config          = BaseConfig.makeProperty(_config);


container.bind<Config>('cli.config').toConstantValue(config);

