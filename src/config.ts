import { Config, IConfigProperty } from '@radic/util'
import interfaces from './interfaces'
import { Container } from "./core/ioc";
const defaultConfig: interfaces.CliConfig | any = {
    mode  : "groups",
    autoExecute: true,
    prettyErrors: true,
    log: {
        level: 'debug'
    },
    text: {

    },
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

    },


    helpers: {
    }
}
const _config                             = new Config(defaultConfig)
const config                       = Config.makeProperty(_config);
export default config;
export {IConfigProperty}
Container.getInstance().bind<IConfigProperty>('console.config').toConstantValue(config);