import { Cli } from "../../../src";
export * from './nodes'
export * from './root'

export const cli = Cli.getInstance();
cli
    .helpers('input') // .helpers('input', 'output')
    .helper('output', {
        // quiet : false,
        quietOption : { enabled: true }, // keys: [ 'q', 'quiet' ]
        // colors: true,
        colorsOption: { enabled: true }, // keys: [ 'C', 'no-colors' ]
        styles      : {
            success: 'blue lighten 20 bold', //'green lighten 20 bold',
        }
    })
    .helper('describer', {
        helpOption: {
            enabled: true //, keys: ['h', 'help']
        }
    })

export default cli;


