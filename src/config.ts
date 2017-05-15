import { Config, IConfigProperty } from "@radic/util";
import { container } from "./Container";
import { CliConfig } from "./interfaces";
const defaultConfig: CliConfig | any = {
    mode        : "groups",
    autoExecute : true,
    prettyErrors: true,
    log         : {
        level: 'debug'
    },
    text        : {},
    parser      : {
        yargs    : {
            'short-option-groups'      : true,
            'camel-case-expansion'     : true,
            'dot-notation'             : true,
            'parse-numbers'            : true,
            'boolean-negation'         : true,
            'duplicate-arguments-array': true,
            'flatten-duplicate-arrays' : true
        },
        arguments: {
            nullUndefined          : true,
            undefinedBooleanIsFalse: true
        },
        options  : {}
    },
    router      : {},


    helpers: {}
}
const _config                        = new Config(defaultConfig)
export const config                         = Config.makeProperty(_config);
export interface ConfigProperty extends IConfigProperty {}

container.bind<IConfigProperty>('cli.config').toConstantValue(config);