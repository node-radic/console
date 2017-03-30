import { Config, IConfigProperty } from '@radic/util'
import interfaces from './interfaces'
import { Container } from "./core/ioc";
const defaultConfig: interfaces.CliConfig | any = {
    mode  : "command",
    log: {
        level: 'debug'
    },
    prettyErrors: true,
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
        output: {
            styles: {
                title   : 'yellow bold',
                subtitle: 'yellow',

                success    : 'green lighten 20 bold',
                warning : 'orange lighten 20 bold',
                error    : 'red lighten 20 bold',


                header     : 'darkorange bold',
                group      : 'steelblue bold',
                command    : 'darkcyan',
                description: 'darkslategray',
                argument   : 'yellow darken 25',

                optional : 'yellow',
                type : 'yellow'
            },
            tableStyle: {
                FAT : {
                    'top'     : '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
                    , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
                    , 'left'  : '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
                    , 'right' : '║', 'right-mid': '╢', 'middle': '│'
                },
                SLIM: { chars: { 'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' } },
                NONE: {
                    'top'     : '', 'top-mid': '', 'top-left': '', 'top-right': ''
                    , 'bottom': '', 'bottom-mid': '', 'bottom-left': '', 'bottom-right': ''
                    , 'left'  : '', 'left-mid': '', 'mid': '', 'mid-mid': ''
                    , 'right' : '', 'right-mid': '', 'middle': ' '
                }
            }
        },

    }
}
const _config                             = new Config(defaultConfig)
export const config                       = Config.makeProperty(_config);
export default config;

Container.getInstance().bind<IConfigProperty>('console.config').toConstantValue(config);