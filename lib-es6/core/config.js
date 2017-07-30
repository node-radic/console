import { Config as BaseConfig } from "@radic/util";
import { container } from "./Container";
import { defaults } from "../defaults";
var defaultConfig = defaults.config();
var _config = new BaseConfig(defaultConfig);
export var config = BaseConfig.makeProperty(_config);
container.bind('cli.config.core').toConstantValue(_config);
container.bind('cli.config').toConstantValue(config);
