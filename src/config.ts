import { Config, IConfigProperty } from '@radic/util'
import interfaces from './interfaces'
import { Container } from "./Core/Container";
const defaultConfig: interfaces.CliConfig | any = {
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
        },
        options: {

        }
    },
    router: {

    }
}
const _config                             = new Config(defaultConfig)
export const config                       = Config.makeProperty(_config);
export default config;

Container.getInstance().bind<IConfigProperty>('console.config').toConstantValue(config);