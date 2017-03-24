import { Config, IConfigProperty } from '@radic/util'
import interfaces from './interfaces'
const defaultConfig: interfaces.CliConfig = {
    mode  : "command",
    parser: {
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
        }
    }
}
const _config                             = new Config(defaultConfig)
export const config                       = Config.makeProperty(_config);
export default config;

